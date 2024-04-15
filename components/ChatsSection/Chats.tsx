import classes from './Chats.module.css';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/store/SearchContext';
import { User } from '@/model/User';
import Chat from './Chat';
import Loader from '../UI/Loader';
import defaultUser from '../../public/defaultUser.jpg';
import { useSession } from 'next-auth/react';
import { Chat as ChatModel } from '@/model/Chat';
import { ChatContext } from '@/store/ChatContext';
import Image from 'next/image';
import { GoSearch } from 'react-icons/go';
import { Unsubscribe } from 'firebase/app-check';

export default function Chats() {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatModel[]>([]);
  const { data: session } = useSession();
  const searchCtx = useContext(SearchContext);
  const chatCtx = useContext(ChatContext);

  //for getting chats, real-time
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;

    const getChats = async () => {
      const { db } = await import('../../util/firebase');
      const { collection, onSnapshot, query, or, where } = await import(
        'firebase/firestore'
      );

      const q = query(
        collection(db, 'chats'),
        or(
          where('user1', '==', session?.user.id),
          where('user2', '==', session?.user.id)
        )
      );

      try {
        unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const update = {
              id: change.doc.id,
              ...change.doc.data(),
            } as ChatModel;

            if (change.type === 'added') {
              setChats((prev) => {
                if (!prev.some((chat) => chat.id === change.doc.id))
                  return [...prev, update];
                else return prev;
              });
            }
            if (change.type === 'modified') {
              setChats((prev) =>
                prev.map((chat) => {
                  if (chat.id === change.doc.id) return update;
                  else return chat;
                })
              );
            }
            if (change.type === 'removed') {
              setChats((prev) =>
                prev.filter((chat) => chat.id !== change.doc.id)
              );
            }
          });
        });
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    if (session) getChats();

    return () => (unsubscribe ? unsubscribe() : undefined);
  }, [session]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user?name=${searchCtx.searchTerm}`);
        if (!res.ok) setError(await res.json());
        else setSearchedUsers((await res.json()).result);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    if (searchCtx.searchTerm === '') setSearchedUsers([]);
    else getUsers();
  }, [searchCtx.searchTerm]);

  const selectUserHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const data = {
      user1: session?.user.id!,
      user1Name: session?.user.firstName! + ' ' + session?.user.lastName!,
      user1Img: session?.user.image!,
      user2: e.currentTarget.id!,
      user2Name:
        e.currentTarget.lastElementChild?.firstElementChild?.innerHTML!,
      user2Img: (e.currentTarget.firstElementChild as HTMLImageElement).src,
      lastMessage: undefined,
    };

    //if user is chating with himself, change user2Id
    //If I don't do so my db logic to check if chat already exists fails, it will always result in true
    if (data.user1 === data.user2) data.user2 += '_';

    setLoading(true);
    if (
      !chatCtx.selectedChat?.lastMessage ||
      Object.keys(chatCtx.selectedChat.lastMessage).length < 1
    ) {
      const res = await fetch(`/api/chat?chatId=${chatCtx.selectedChat?.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) setError('Unable to delete the chat');
    }

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setLoading(false);
    if (!res.ok) setError('Unable to select user');
    else {
      const chatId = (await res.json()).result;
      setSearchedUsers([]);
      searchCtx.setSearchTerm('');

      const returnedChat = { id: chatId as string, ...data };
      setChats((prev) => [returnedChat, ...prev]);
      chatCtx.setSelectedChat(returnedChat);
    }
  };

  const usersList = searchedUsers.map((user) => (
    <div
      key={user.id}
      id={user.id}
      className={classes.user}
      onClick={selectUserHandler}
    >
      <Image
        src={user.profileImg ? user.profileImg : defaultUser.src}
        alt="profile-img"
        width={40}
        height={40}
        className={classes.profileImg}
      />
      <div>
        <p className={classes.name}>{user.firstName + ' ' + user.lastName}</p>
        <p className={classes.email}>{user.email}</p>
      </div>
    </div>
  ));

  const chatsList = chats
    ?.sort((a, b) => {
      if (a.lastMessage?.message && b.lastMessage?.message)
        return +b.lastMessage.date - +a.lastMessage.date;
      else return 0;
    })
    //filtering out chats to not show up on receiver's side if no message has been sent yet
    .filter((chat) =>
      chat.lastMessage && Object.keys(chat.lastMessage).length === 0
        ? chat.user1 === session?.user.id
        : chat
    )
    .map((chat) => <Chat key={chat.id} chat={chat} />);

  return (
    <div className={classes.chats}>
      {searchCtx.searchTerm ? (
        loading ? (
          <Loader className={classes.loader} color="black" />
        ) : searchedUsers.length < 1 ? (
          <p className={classes.notFound}>No Users found</p>
        ) : (
          <div className={classes.users}>{usersList}</div>
        )
      ) : loading ? (
        <Loader className={classes.loader} color="black" />
      ) : chatsList.length > 0 ? (
        chatsList
      ) : (
        <div className={classes.empty}>
          <GoSearch className={classes.icon} />
          <p>Search your friends & start the conversation! </p>
        </div>
      )}
    </div>
  );
}

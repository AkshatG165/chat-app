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

export default function Chats() {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatModel[]>([]);
  const { data: session } = useSession();
  const searchCtx = useContext(SearchContext);
  const chatCtx = useContext(ChatContext);

  //setting latest chat to message window
  if (chats.length > 0 && !chatCtx.selectedChat)
    chatCtx.setSelectedChat(chats[0]);

  useEffect(() => {
    if (session) {
      (async () => {
        const { db } = await import('../../util/firebase');
        const { collection, onSnapshot, query, or, where } = await import(
          'firebase/firestore'
        );

        const q = query(
          collection(db, 'chats'),
          or(
            where('user1', '==', session.user.id),
            where('user2', '==', session.user.id)
          )
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
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
          setLoading(false);
        });

        return unsubscribe;
      })();
    }
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

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) setError('Unable to chat user');
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
      ) : (
        chatsList
      )}
    </div>
  );
}

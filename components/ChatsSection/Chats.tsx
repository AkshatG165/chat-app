import classes from './Chats.module.css';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/store/SearchContext';
import { User } from '@/model/User';
import Chat from './Chat';
import Loader from '../UI/Loader';
import defaultUser from '../../public/defaultUser.jpg';
import { useSession } from 'next-auth/react';
import { Chat as ChatModel } from '@/model/Chat';
import { Message } from '@/model/Message';
import { useRouter } from 'next/router';

type State = {
  chat: ChatModel;
  message: Message;
};

let isInitial = true;

export default function Chats() {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<State[]>();

  const searchCtx = useContext(SearchContext);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const resChat = await fetch(`/api/chat?userId=${session?.user.id}`);
        const chat = await resChat.json();
        if (!resChat.ok) setError(chat);

        (chat.result as ChatModel[]).forEach(async (chat) => {
          const resMessages = await fetch(
            `/api/message?chatId=${chat.id}&count=1`
          );
          const message = await resMessages.json();
          if (!resMessages.ok) setError(message);

          setChats((prev) =>
            prev
              ? [...prev, { chat, message: message.result[0] }]
              : [{ chat, message: message.result[0] }]
          );
        });
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };
    if (!isInitial) getChats();
    else isInitial = false;
  }, []);

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
      user1: session?.user.id,
      user1Name: session?.user.firstName + ' ' + session?.user.lastName,
      user1Img: session?.user.image,
      user2: e.currentTarget.id,
      user2Name: e.currentTarget.lastElementChild?.firstElementChild?.innerHTML,
      user2Img: (e.currentTarget.firstElementChild as HTMLImageElement).src,
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
      router.query.chatId = chatId;
    }
  };

  const usersList = searchedUsers.map((user) => (
    <div
      key={user.id}
      id={user.id}
      className={classes.user}
      onClick={selectUserHandler}
    >
      <img
        src={user.profileImg ? user.profileImg : defaultUser.src}
        className={classes.profileImg}
      />
      <div>
        <p className={classes.name}>{user.firstName + ' ' + user.lastName}</p>
        <p className={classes.email}>{user.email}</p>
      </div>
    </div>
  ));

  const chatsList = chats
    ?.filter((chat) => {
      if (chat.message) return chat;
    })
    .sort((a, b) => +b.message.date - +a.message.date)
    .map((chat) => (
      <Chat key={chat.chat.id} chat={chat.chat} message={chat.message} />
    ));

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
      ) : (
        chatsList
      )}
    </div>
  );
}

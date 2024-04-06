import classes from './Chats.module.css';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/store/SearchContext';
import { User } from '@/model/User';
import Chat from './Chat';
import Loader from '../UI/Loader';
import defaultUser from '../../public/defaultUser.jpg';
import { useSession } from 'next-auth/react';
import { Chat as ChatModel } from '@/model/Chat';

export default function Chats() {
  const searchCtx = useContext(SearchContext);
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [selectedChat, setSelectedChat] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat?userId=${session?.user.id}`);
        if (!res.ok) setError(await res.json());
        else setChats((await res.json()).result);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };
    getChats();
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
      setSelectedChat(chatId);
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

  const chatsList = chats.map((chat) => (
    <Chat
      key={chat.id}
      chat={chat}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
    />
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

// const chats = [
//   {
//     id: '1',
//     name: 'Akshat Gupta',
//     profilePic,
//     online: true,
//     message: {
//       message: 'Hi, How are u? This is a dummy message.',
//       date: new Date(2024, 2, 19, 15, 15),
//     },
//   },
//   {
//     id: '2',
//     name: 'Akshat Gupta',
//     profilePic,
//     online: false,
//     message: {
//       message:
//         'Hi, How are u? This is a dummy message.Hi, How are u? This is a dummy message.Hi, How are u? This is a dummy message.',
//       date: new Date(2024, 2, 18, 17, 15),
//     },
//   },
//   {
//     id: '3',
//     name: 'Akshat Gupta',
//     profilePic,
//     online: true,
//     message: {
//       message: 'Hi, How are u? This is a dummy message.',
//       date: new Date(2024, 2, 19, 16, 20),
//     },
//   },
// ];

//chats.sort((a, b) => +b.message.date - +a.message.date);

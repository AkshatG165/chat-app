import classes from './Chats.module.css';
import profilePic from '../../public/pic.jpg';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@/store/contexts/SearchContext';
import { User } from '@/model/User';
import Chat from './Chat';
import Loader from '../UI/Loader';
import defaultUser from '../../public/defaultUser.jpg';

const chats = [
  {
    id: '1',
    name: 'Akshat Gupta',
    profilePic,
    online: true,
    message: {
      message: 'Hi, How are u? This is a dummy message.',
      date: new Date(2024, 2, 19, 15, 15),
    },
  },
  {
    id: '2',
    name: 'Akshat Gupta',
    profilePic,
    online: false,
    message: {
      message:
        'Hi, How are u? This is a dummy message.Hi, How are u? This is a dummy message.Hi, How are u? This is a dummy message.',
      date: new Date(2024, 2, 18, 17, 15),
    },
  },
  {
    id: '3',
    name: 'Akshat Gupta',
    profilePic,
    online: true,
    message: {
      message: 'Hi, How are u? This is a dummy message.',
      date: new Date(2024, 2, 19, 16, 20),
    },
  },
];

chats.sort((a, b) => +b.message.date - +a.message.date);

export default function Chats() {
  const searchCtx = useContext(SearchContext);
  const [selectedChat, setSelectedChat] = useState(chats[0].id);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user?name=${searchCtx.searchTerm}`);
        if (!res.ok) {
          const message = await res.json();
          setError(message);
        } else setSearchedUsers((await res.json()).result);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    if (searchCtx.searchTerm === '') setSearchedUsers([]);
    else getUsers();
  }, [searchCtx.searchTerm]);

  const usersList = searchedUsers.map((user) => (
    <div key={user.email} className={classes.user}>
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

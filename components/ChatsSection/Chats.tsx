import classes from './Chats.module.css';
import Image from 'next/image';
import profilePic from '../../public/pic.jpg';
import Link from 'next/link';
import { useState } from 'react';

const chats = [
  {
    id: '1',
    name: 'Akshat Gupta',
    message: 'Hi, How are u? This is a dummy message.',
    profilePic,
  },
  {
    id: '2',
    name: 'Akshat Gupta',
    message:
      'Hi, How are u? This is a dummy message. Hi, How are u? This is a dummy message. Hi, How are u? This is a dummy message.',
    profilePic,
  },
  {
    id: '3',
    name: 'Akshat Gupta',
    message: 'Hi, How are u? This is a dummy message.',
    profilePic,
  },
];

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState(chats[0].id);

  const chatSelectHandler = (e: React.MouseEvent) =>
    setSelectedChat(e.currentTarget.id);

  const chatsList = chats.map((chat) => (
    <Link
      id={chat.id}
      href="#"
      className={`${classes.chat} ${
        chat.id === selectedChat ? classes.active : ''
      }`}
      onClick={chatSelectHandler}
    >
      <Image
        src={chat.profilePic}
        alt="profile-pic"
        height={40}
        width={40}
        className={classes.profilepic}
      />
      <div className={classes.content}>
        <p className={classes.name}>{chat.name}</p>
        <p className={classes.message}>{chat.message}</p>
      </div>
    </Link>
  ));

  return <div className={classes.chats}>{chatsList}</div>;
}

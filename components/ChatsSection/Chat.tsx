import Link from 'next/link';
import classes from './Chat.module.css';
import Image from 'next/image';
import { FaCircle } from 'react-icons/fa';
import { formatDate, formatTime } from '@/util/helper';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type Chat = {
  id: string;
  name: string;
  profilePic: StaticImport;
  online: boolean;
  message: {
    message: string;
    date: Date;
  };
};

type Props = {
  chat: Chat;
  selectedChat: string;
  setSelectedChat: React.Dispatch<React.SetStateAction<string>>;
};

export default function Chat({ chat, selectedChat, setSelectedChat }: Props) {
  const chatSelectHandler = (e: React.MouseEvent) =>
    setSelectedChat(e.currentTarget.id);

  return (
    <Link
      key={chat.id}
      id={chat.id}
      href="#"
      className={`${classes.chat} ${
        chat.id === selectedChat ? classes.active : ''
      }`}
      onClick={chatSelectHandler}
    >
      <div className={classes.imgContainer}>
        <Image
          src={chat.profilePic}
          alt="profile-pic"
          height={40}
          width={40}
          className={classes.profilepic}
        />
        {chat.online && <FaCircle className={classes.dot} />}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>
          <p className={classes.name}>{chat.name}</p>
          <p className={classes.date}>
            {formatDate(chat.message.date) === formatDate(new Date())
              ? formatTime(chat.message.date)
              : formatDate(chat.message.date)}
          </p>
        </div>
        <p className={classes.message}>{chat.message.message}</p>
      </div>
    </Link>
  );
}

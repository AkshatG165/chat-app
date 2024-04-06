import Link from 'next/link';
import classes from './Chat.module.css';
import { FaCircle } from 'react-icons/fa';
import { formatDate, formatTime } from '@/util/helper';
import { Chat as ChatModel } from '@/model/Chat';
import { useSession } from 'next-auth/react';
import { Message } from '@/model/Message';

type Props = {
  chat: ChatModel;
  selectedChat: string;
  setSelectedChat: React.Dispatch<React.SetStateAction<string>>;
  message?: Message;
};

export default function Chat({
  chat,
  selectedChat,
  setSelectedChat,
  message,
}: Props) {
  const { data: session } = useSession();

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
        <img
          src={session?.user.id === chat.user1 ? chat.user2Img : chat.user1Img}
          alt="profile-pic"
          height={40}
          width={40}
          className={classes.profilepic}
        />
        {/* {chat.online && <FaCircle className={classes.dot} />} */}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>
          <p className={classes.name}>
            {session?.user.id === chat.user1 ? chat.user2Name : chat.user1Name}
          </p>
          {message && (
            <p className={classes.date}>
              {formatDate(message.date) === formatDate(Date.now())
                ? formatTime(message.date)
                : formatDate(message.date)}
            </p>
          )}
        </div>
        {message && <p className={classes.message}>{message.message}</p>}
      </div>
    </Link>
  );
}

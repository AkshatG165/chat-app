import Link from 'next/link';
import classes from './Chat.module.css';
import { FaCircle } from 'react-icons/fa';
import { formatDate, formatTime } from '@/util/helper';
import { Chat as ChatModel } from '@/model/Chat';
import { useSession } from 'next-auth/react';
import { Message } from '@/model/Message';
import { useContext } from 'react';
import { ChatContext } from '@/store/ChatContext';
import Image from 'next/image';

type Props = {
  chat: ChatModel;
  message?: Message;
};

export default function Chat({ chat, message }: Props) {
  const { data: session } = useSession();
  const chatCtx = useContext(ChatContext);

  const handleChatSelect = () => chatCtx.setSelectedChat(chat);

  return (
    <Link
      key={chat.id}
      id={chat.id}
      href={`?chatId=${chat.id}`}
      className={`${classes.chat} ${
        chat.id === chatCtx.selectedChat?.id ? classes.active : ''
      }`}
      onClick={handleChatSelect}
    >
      <div className={classes.imgContainer}>
        <Image
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

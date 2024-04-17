import Link from 'next/link';
import classes from './Chat.module.css';
import { FaCircle } from 'react-icons/fa';
import { formatDate, formatTime } from '@/util/helper';
import { Chat as ChatModel } from '@/model/Chat';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { ChatContext } from '@/store/ChatContext';
import Image from 'next/image';
import defaultUser from '../../public/defaultUser.jpg';
import { ShowChatsContext } from '@/store/ShowChatsContext';

export default function Chat({ chat }: { chat: ChatModel }) {
  const { data: session } = useSession();
  const chatCtx = useContext(ChatContext);
  const showChatsCtx = useContext(ShowChatsContext);

  const handleChatSelect = () => {
    chatCtx.setSelectedChat(chat);
    showChatsCtx.setShowChats(false);
  };

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
          src={
            session?.user.id === chat.user1
              ? chat.user2Img || defaultUser
              : chat.user1Img || defaultUser
          }
          alt="profile-pic"
          height={40}
          width={40}
          priority
          className={classes.profilepic}
        />
        {/* {chat.online && <FaCircle className={classes.dot} />} */}
      </div>
      <div className={classes.content}>
        <div className={classes.title}>
          <p className={classes.name}>
            {session?.user.id === chat.user1 ? chat.user2Name : chat.user1Name}
          </p>
          {chat.lastMessage?.message && (
            <p className={classes.date}>
              {formatDate(chat.lastMessage.date) === formatDate(Date.now())
                ? formatTime(chat.lastMessage.date)
                : formatDate(chat.lastMessage.date)}
            </p>
          )}
        </div>
        {chat.lastMessage && (
          <p className={classes.message}>{chat.lastMessage.message}</p>
        )}
      </div>
    </Link>
  );
}

import classes from './Message.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Message as MessageModel } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import { formatTime } from '@/util/helper';
import { LuClock3 } from 'react-icons/lu';
import Image from 'next/image';
import { BiCheckDouble } from 'react-icons/bi';
import defaultUser from '../../public/defaultUser.jpg';

type Props = { message: MessageModel; prevMessage: MessageModel };

export default function Message({ message, prevMessage }: Props) {
  const { data: session } = useSession();
  const chatCtx = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialized = useRef(false);

  //checking if margin-top is required for this message
  const marginTop = prevMessage.from !== message.from ? classes.marginTop : '';

  //For sending messages to db
  useEffect(() => {
    const data = {
      chatId: chatCtx.selectedChat?.id,
      date: message.date,
      from: message.from,
      message: message.message,
    };

    const sendMessages = async () => {
      setLoading((prev) => !prev);
      try {
        const res = await fetch(`/api/message`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const message = await res.json();
        if (!res.ok) setError(message);
      } catch (err: any) {
        setError(err);
      }
    };

    const updateChat = async () => {
      delete data.chatId;
      try {
        const res = await fetch(`/api/chat`, {
          method: 'PATCH',
          body: JSON.stringify({
            chatId: chatCtx.selectedChat?.id,
            lastMessage: data,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) setError((await res.json()).result);
      } catch (err: any) {
        setError(err);
      }
      setLoading((prev) => !prev);
    };

    if (!initialized.current && !isNaN(+message.id)) {
      initialized.current = true;

      sendMessages();
      updateChat();
    }
  }, [chatCtx.selectedChat?.id, message]);

  return (
    <div
      className={`${classes.msgContainer + ' ' + marginTop} ${
        message.from === session?.user.id ? classes.rightMsgContainer : ''
      }`}
    >
      {message.from !== session?.user.id && (
        <div className={classes.imgContainer}>
          {prevMessage.from !== message.from && (
            <Image
              src={
                session?.user.id === chatCtx.selectedChat?.user1
                  ? chatCtx.selectedChat?.user2Img || defaultUser
                  : chatCtx.selectedChat?.user1Img || defaultUser
              }
              alt="profile-pic"
              height={40}
              width={40}
              className={classes.profilepic}
            />
          )}
        </div>
      )}
      <div
        className={`${classes.message} ${
          message.from === session?.user.id ? classes.rightMessage : ''
        }`}
      >
        <p className={classes.text}>{message.message}</p>
        <p className={classes.date}>
          {formatTime(message.date)}
          {session?.user.id === message.from && (
            <span>
              {loading ? (
                <LuClock3 />
              ) : (
                <BiCheckDouble className={classes.delivered} />
              )}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

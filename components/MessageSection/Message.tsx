import classes from './Message.module.css';
import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Message as MessageModel } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import { formatTime } from '@/util/helper';
import { LuClock3 } from 'react-icons/lu';
import { TiTick } from 'react-icons/ti';
import Image from 'next/image';

type Props = {
  message: MessageModel;
};

export default function Message({ message }: Props) {
  const { data: session } = useSession();
  const chatCtx = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //For sending messages to db
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const data = {
      chatId: chatCtx.selectedChat?.id,
      date: message.date,
      from: message.from,
      message: message.message,
    };

    const sendMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/message`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: signal,
        });
        const message = await res.json();
        if (!res.ok) setError(message);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    if (!isNaN(+message.id)) sendMessages();

    return () => {
      controller.abort();
    };
  }, [chatCtx.selectedChat?.id, message]);

  return (
    <div
      className={`${classes.msgContainer} ${
        message.from === session?.user.id ? classes.rightMsgContainer : ''
      }`}
    >
      {message.from !== session?.user.id && (
        <Image
          src={
            session?.user.id === chatCtx.selectedChat?.user1
              ? chatCtx.selectedChat?.user2Img || ''
              : chatCtx.selectedChat?.user1Img || ''
          }
          alt="profile-pic"
          height={40}
          width={40}
          className={classes.profilepic}
        />
      )}
      <div
        className={`${classes.message} ${
          message.from === session?.user.id ? classes.rightMessage : ''
        }`}
      >
        <p className={classes.text}>{message.message}</p>
        <p className={classes.date}>
          {formatTime(message.date)}
          <span>{loading ? <LuClock3 /> : <TiTick />}</span>
        </p>
      </div>
    </div>
  );
}

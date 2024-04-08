import classes from './MessageSection.module.css';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';
import { useContext, useEffect, useState } from 'react';
import { Message } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import Loader from '../UI/Loader';

let isInitial = true;

export default function MessageSection() {
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(''); //can be '', 'sending', 'getting'
  const [error, setError] = useState<string | null>(null);
  const chatCtx = useContext(ChatContext);

  //For getting messages
  useEffect(() => {
    const getMessages = async () => {
      setLoading('getting');
      try {
        const res = await fetch(
          `/api/message?chatId=${chatCtx.selectedChat?.id}&count=100`
        );
        const message = await res.json();
        if (!res.ok) setError(message);

        setMessages(message.result);
      } catch (err: any) {
        setError(err);
      }
      setLoading('');
    };

    getMessages();
  }, [chatCtx.selectedChat]);

  //For sending messages to db
  useEffect(() => {
    const sendMessages = async () => {
      setLoading('sending');
      const data = {
        chatId: chatCtx.selectedChat?.id,
        date: messages![messages!.length - 1].date,
        from: messages![messages!.length - 1].from,
        message: messages![messages!.length - 1].message,
      };

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
      setLoading('');
    };

    if (!isInitial) {
      if (
        messages &&
        messages.length > 0 &&
        //because i am setting id as date timestamp of f its not NaN thes its inserted by me & not from db
        !isNaN(+messages[messages.length - 1].id)
      )
        sendMessages();
    } else isInitial = false;
  }, [messages]);

  return (
    <div className={classes.card}>
      <Header />
      {loading === 'getting' ? (
        <Loader color="black" width={40} />
      ) : (
        <Messages messages={messages} loading={loading} />
      )}
      <Input setMessages={setMessages} />
    </div>
  );
}

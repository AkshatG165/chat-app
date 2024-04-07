import classes from './MessageSection.module.css';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';
import { useContext, useEffect, useState } from 'react';
import { Message } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import Loader from '../UI/Loader';

export default function MessageSection() {
  const [messages, setMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatCtx = useContext(ChatContext);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    getMessages();
  }, [chatCtx.selectedChat]);

  return (
    <div className={classes.card}>
      <Header />
      {loading ? (
        <Loader color="black" width={40} />
      ) : (
        <Messages messages={messages} />
      )}
      <Input setMessages={setMessages} />
    </div>
  );
}

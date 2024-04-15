import classes from './MessageSection.module.css';
import { useContext, useEffect, useState } from 'react';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';
import { Message } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import Loader from '../UI/Loader';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { Unsubscribe } from 'firebase/database';

export default function MessageSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatCtx = useContext(ChatContext);
  const { data: session } = useSession();

  //for getting messages
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;
    setMessages([]);

    const getMessages = async () => {
      setLoading(true);
      const { db } = await import('../../util/firebase');
      const { collection, onSnapshot, orderBy, query, limit } = await import(
        'firebase/firestore'
      );

      const q = query(
        collection(db, 'chats', chatCtx.selectedChat?.id!, 'messages'),
        orderBy('date', 'desc'),
        limit(50)
      );

      try {
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const returnedMessage = { id: doc.id, ...doc.data() } as Message;

            setMessages((prev) => {
              if (!prev.some((message) => message.id === doc.id))
                return [...prev, returnedMessage].filter((message) =>
                  isNaN(+message.id)
                );
              else return prev.filter((message) => isNaN(+message.id));
            });
          });
        });
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    if (chatCtx.selectedChat) getMessages();

    return () => (unsubscribe ? unsubscribe() : undefined);
  }, [chatCtx.selectedChat]);

  return (
    <div className={classes.card}>
      {(chatCtx.selectedChat && messages.length > 0) ||
      session?.user.id === chatCtx.selectedChat?.user1 ? (
        <>
          <Header />
          {loading ? (
            <Loader color="black" width={40} />
          ) : (
            <Messages
              messages={messages.toSorted((a, b) => +a.date - +b.date)}
            />
          )}
          <Input setMessages={setMessages} />
        </>
      ) : (
        <div className={classes.empty}>
          <BiMessageSquareDetail className={classes.icon} />
          <h2>Welcome to the Messaging App</h2>
          <p>You can chat with your friends </p>
        </div>
      )}
    </div>
  );
}

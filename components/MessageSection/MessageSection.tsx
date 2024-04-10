import classes from './MessageSection.module.css';
import { useContext, useEffect, useState } from 'react';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';
import { Message } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import Loader from '../UI/Loader';
import { BiMessageSquareDetail } from 'react-icons/bi';

export default function MessageSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatCtx = useContext(ChatContext);

  //for getting messages
  useEffect(() => {
    setMessages([]);
    setLoading(true);
    if (chatCtx.selectedChat) {
      (async () => {
        const { db } = await import('../../util/firebase');
        const { collection, onSnapshot, orderBy, query } = await import(
          'firebase/firestore'
        );

        const q = query(
          collection(db, 'chats', chatCtx.selectedChat?.id!, 'messages'),
          orderBy('date')
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
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
          setLoading(false);
        });

        return unsub;
      })();
    }
  }, [chatCtx.selectedChat]);

  return (
    <div className={classes.card}>
      {chatCtx.selectedChat ? (
        <>
          <Header />
          {loading ? (
            <Loader color="black" width={40} />
          ) : (
            <Messages messages={messages} />
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

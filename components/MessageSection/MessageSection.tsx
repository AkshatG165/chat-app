import classes from './MessageSection.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';
import { Message } from '@/model/Message';
import { ChatContext } from '@/store/ChatContext';
import Loader from '../UI/Loader';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { Unsubscribe } from 'firebase/database';

type Props = {
  className?: string;
};

let fetchingOld = false;
let startAfterIndex = 49;

export default function MessageSection({ className }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatCtx = useContext(ChatContext);
  const { data: session } = useSession();

  //for getting initial messages & new incomming
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;
    setMessages([]);

    const getMessages = async () => {
      setLoading((prev) => !prev);
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
      setLoading((prev) => !prev);
    };

    if (chatCtx.selectedChat) getMessages();

    return () => (unsubscribe ? unsubscribe() : undefined);
  }, [chatCtx.selectedChat]);

  //for scrolling to the bottom of the page
  useEffect(() => {
    if (messages.length === 50) startAfterIndex = 49;
    const MsgContainer = document.getElementById('MsgContainer');
    if (
      MsgContainer &&
      (MsgContainer.scrollHeight - MsgContainer.clientHeight <=
        MsgContainer.scrollTop + 200 ||
        (MsgContainer.scrollTop === 0 && !fetchingOld))
    )
      MsgContainer?.scrollTo({
        top: MsgContainer.scrollHeight,
        behavior: messages?.length === 50 ? 'instant' : 'smooth',
      });

    if (fetchingOld) fetchingOld = false;
  }, [messages?.length]);

  //Fetching old messages when scrolled all the way to the top
  const scrollHandler = async () => {
    if (loading) return;
    const MsgContainer = document.getElementById('MsgContainer');

    if (
      MsgContainer?.scrollTop === 0 &&
      MsgContainer?.clientHeight !== MsgContainer?.scrollHeight //if no scroll is available
    ) {
      try {
        fetchingOld = true;
        setLoading(true);

        const res = await fetch(
          `/api/message?chatId=${chatCtx.selectedChat?.id}&date=${
            messages.length > 0 ? messages[startAfterIndex].date : 9999999999999
          }&count=50`
        );
        if (!res.ok) setError('Unable to fetch older messages');
        const olderMessages = (await res.json()).result;

        setMessages((prev) => [...prev, ...olderMessages]);
        startAfterIndex += 50;
        MsgContainer?.scrollTo({
          top: 1,
          behavior: 'instant',
        });
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    }
  };

  return (
    <div className={classes.card + ' ' + className}>
      {(chatCtx.selectedChat && messages.length > 0) ||
      session?.user.id === chatCtx.selectedChat?.user1 ? (
        <>
          <Header />
          {loading && (
            <div className={classes.loader}>
              <Loader color="black" width={40} />
            </div>
          )}
          <Messages
            messages={messages.toSorted((a, b) => +a.date - +b.date)}
            scrollHandler={scrollHandler}
          />
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

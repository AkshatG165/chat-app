import classes from './Home.module.css';
import Sidebar from './Sidebar/Sidebar';
import ChatsSection from './ChatsSection/ChatsSection';
import MessageSection from './MessageSection/MessageSection';
import Card from './UI/Card';
import ChatContextProvider from '@/store/ChatContext';
import { useContext } from 'react';
import { ShowChatsContext } from '@/store/ShowChatsContext';

export default function Home({ isMobile }: { isMobile: boolean }) {
  const showChatsCtx = useContext(ShowChatsContext);
  if (isMobile) showChatsCtx.setShowChats(false);

  return (
    <ChatContextProvider>
      <Card className={isMobile ? classes.cardMobile : classes.card}>
        <Sidebar
          className={showChatsCtx.showChats ? classes.mobile : classes.desktop}
        />
        <ChatsSection
          className={showChatsCtx.showChats ? classes.mobile : classes.desktop}
        />
        <MessageSection
          className={showChatsCtx.showChats ? classes.desktop : classes.mobile}
        />
      </Card>
    </ChatContextProvider>
  );
}

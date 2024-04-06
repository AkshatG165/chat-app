import classes from './Home.module.css';
import Sidebar from './Sidebar/Sidebar';
import ChatsSection from './ChatsSection/ChatsSection';
import MessageSection from './MessageSection/MessageSection';
import Card from './UI/Card';
import ChatContextProvider from '@/store/ChatContext/ChatContext';

export default function Home() {
  return (
    <ChatContextProvider>
      <Card className={classes.card}>
        <Sidebar />
        <ChatsSection />
        <MessageSection />
      </Card>
    </ChatContextProvider>
  );
}

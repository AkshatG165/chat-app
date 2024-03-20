import classes from './Home.module.css';
import Sidebar from './Sidebar/Sidebar';
import ChatsSection from './ChatsSection/ChatsSection';
import MessageSection from './MessageSection/MessageSection';
import Card from './UI/Card';

export default function Home() {
  return (
    <Card className={classes.card}>
      <Sidebar />
      <ChatsSection />
      <MessageSection />
    </Card>
  );
}

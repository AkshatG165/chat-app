import classes from './ChatsSection.module.css';
import Card from '../UI/Card';
import Search from './Search';
import Chats from './Chats';
import SearchContextProvider from '@/store/SearchContext';

export default function ChatsSection({ className }: { className?: string }) {
  return (
    <SearchContextProvider>
      <Card className={classes.card + ' ' + className}>
        <div className={classes.header}>
          <p>Messages</p>
        </div>
        <Search />
        <Chats />
      </Card>
    </SearchContextProvider>
  );
}

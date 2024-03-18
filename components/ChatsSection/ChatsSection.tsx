import classes from './ChatsSection.module.css';
import Card from '../UI/Card';
import Search from './Search';
import Chats from './Chats';
import { FaUserPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function ChatsSection() {
  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <h2>Messages</h2>
        <Link href="#">
          <FaUserPlus className={classes.icon} />
        </Link>
      </div>
      <Search />
      <Chats />
    </Card>
  );
}

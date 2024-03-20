import classes from './MessageSection.module.css';
import Card from '../UI/Card';
import Header from './Header';
import Input from './Input';
import Messages from './Messages';

export default function MessageSection() {
  return (
    <div className={classes.card}>
      <Header />
      <Messages />
      <Input />
    </div>
  );
}

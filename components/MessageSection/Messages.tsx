import Image from 'next/image';
import classes from './Messages.module.css';
import profilePic from '../../public/pic.jpg';
import { formatDate, formatTime } from '@/util/helper';

const chat = {
  profilePic,
  messages: [
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    { date: new Date(), message: 'Hi, This is a dummy message' },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message:
        'Hi, This is a dummy message Hi, This is a dummy message Hi, This is a dummy message Hi, This is a dummy message is a dummy message Hi, This is a dummy message Hi, This is a dummy message ',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
  ],
};

export default function Messages() {
  const messagesList = chat.messages.map((message) => (
    <div
      className={`${classes.message} ${
        message.from === 'me' ? classes.rightMessage : ''
      }`}
    >
      {message.from !== 'me' && (
        <Image
          src={chat.profilePic}
          alt="profile-pic"
          height={40}
          width={40}
          className={classes.profilepic}
        />
      )}
      <div
        className={`${classes.msgContainer} ${
          message.from === 'me' ? classes.rightMsgContainer : ''
        }`}
      >
        <p className={classes.text}>{message.message}</p>
        <p className={classes.date}>
          {formatDate(message.date) === formatDate(new Date())
            ? formatTime(message.date)
            : formatDate(message.date)}
        </p>
      </div>
    </div>
  ));

  return <div className={classes.container}>{messagesList}</div>;
}

import Image from 'next/image';
import classes from './Messages.module.css';
import profilePic from '../../public/pic.jpg';
import { formatDate, formatTime } from '@/util/helper';

const chat = {
  profilePic,
  messages: [
    {
      id: '1',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '20',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '2',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message:
        'Hi, This is a dummy message Hi, This is a dummy message Hi, This is a dummy message Hi, This is a dummy message is a dummy message Hi, This is a dummy message Hi, This is a dummy message ',
    },
    {
      id: '3',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '4',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '5',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '6',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '7',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '8',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '9',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '10',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '11',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '12',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '13',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '14',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '15',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '16',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '17',
      date: new Date(),
      from: 'akshat',
      to: 'me',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '18',
      date: new Date(),
      from: 'me',
      to: 'akshat',
      message: 'Hi, This is a dummy message',
    },
    {
      id: '19',
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
      key={message.id}
      className={`${classes.msgContainer} ${
        message.from === 'me' ? classes.rightMsgContainer : ''
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
        className={`${classes.message} ${
          message.from === 'me' ? classes.rightMessage : ''
        }`}
      >
        <p className={classes.text}>{message.message}</p>
        <p className={classes.date}>{formatTime(message.date)}</p>
      </div>
    </div>
  ));

  return <div className={classes.container}>{messagesList}</div>;
}

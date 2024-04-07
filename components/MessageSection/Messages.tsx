import classes from './Messages.module.css';
import { formatTime } from '../../util/helper';
import { Message } from '@/model/Message';
import { useContext } from 'react';
import { ChatContext } from '@/store/ChatContext';
import { useSession } from 'next-auth/react';

type Props = {
  messages: Message[] | undefined;
};

export default function Messages({ messages }: Props) {
  const chatCtx = useContext(ChatContext);
  const { data: session } = useSession();

  const messagesList = messages?.map((message) => (
    <div
      key={message.id}
      className={`${classes.msgContainer} ${
        message.from === session?.user.id ? classes.rightMsgContainer : ''
      }`}
    >
      {message.from !== session?.user.id && (
        <img
          src={
            session?.user.id === chatCtx.selectedChat?.user1
              ? chatCtx.selectedChat?.user2Img
              : chatCtx.selectedChat?.user1Img
          }
          alt="profile-pic"
          height={40}
          width={40}
          className={classes.profilepic}
        />
      )}
      <div
        className={`${classes.message} ${
          message.from === session?.user.id ? classes.rightMessage : ''
        }`}
      >
        <p className={classes.text}>{message.message}</p>
        <p className={classes.date}>{formatTime(message.date)}</p>
      </div>
    </div>
  ));

  return <div className={classes.container}>{messagesList}</div>;
}

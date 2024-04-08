import classes from './Messages.module.css';
import { Message as MessageModel } from '@/model/Message';
import Message from './Message';

type Props = {
  messages: MessageModel[] | undefined;
};

export default function Messages({ messages }: Props) {
  const messagesList = messages?.map((message) => (
    <Message key={message.id} message={message} />
  ));

  return <div className={classes.container}>{messagesList}</div>;
}

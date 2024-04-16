import classes from './Messages.module.css';
import { Message as MessageModel } from '@/model/Message';
import Message from './Message';

type Props = {
  messages: MessageModel[] | undefined;
  scrollHandler: () => void;
};

export default function Messages({ messages, scrollHandler }: Props) {
  let currentIndex = 0;

  const messagesList = messages?.map((message) => {
    currentIndex += 1;
    return (
      <Message
        key={message.id}
        message={message}
        prevMessage={
          currentIndex - 2 >= 0
            ? messages[currentIndex - 2]
            : { id: '', date: 0, from: '', message: '' }
        }
      />
    );
  });

  return (
    <div
      id="MsgContainer"
      className={classes.container}
      onScroll={scrollHandler}
    >
      {messagesList}
    </div>
  );
}

import classes from './Messages.module.css';
import { Message as MessageModel } from '@/model/Message';
import Message from './Message';
import { useEffect } from 'react';

type Props = {
  messages: MessageModel[] | undefined;
};

export default function Messages({ messages }: Props) {
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

  //for scrolling to the bottom of the page
  useEffect(() => {
    const MsgContainer = document.getElementById('MsgContainer');
    MsgContainer?.scrollTo({
      top: MsgContainer.scrollHeight,
      behavior: messages?.length === 50 ? 'instant' : 'smooth',
    });
  }, [messages]);

  return (
    <div id="MsgContainer" className={classes.container}>
      {messagesList}
    </div>
  );
}

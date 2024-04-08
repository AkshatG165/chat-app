import classes from './Input.module.css';
import { IoSend } from 'react-icons/io5';
import { CgAttachment } from 'react-icons/cg';
import { FaMicrophone } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { MdPhoto } from 'react-icons/md';
import { Message } from '@/model/Message';
import { useSession } from 'next-auth/react';

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
};

export default function Input({ setMessages }: Props) {
  const [val, setVal] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { data: session } = useSession();

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  useEffect(resizeTextArea, [val]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setVal(e.target.value);

  const enterHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!e.currentTarget.value || e.currentTarget.value.trim().length === 0)
        return;

      const message = {
        id: Date.now().toString(),
        date: Date.now(),
        from: session?.user.id!,
        message: e.currentTarget.value,
      };

      setMessages((prev) => (prev ? [...prev, message] : [message]));
      setVal('');
    }
  };

  return (
    <div className={classes.container}>
      <textarea
        id="message"
        name="message"
        placeholder="Type a message..."
        className={classes.input}
        rows={1}
        ref={textAreaRef}
        value={val}
        onChange={onChangeHandler}
        onKeyDown={enterHandler}
      />
      <div className={classes.icons}>
        <CgAttachment className={classes.icon} />
        <FaMicrophone className={classes.icon} />
        <MdPhoto className={classes.icon} />
        <IoSend className={classes.icon} />
      </div>
    </div>
  );
}

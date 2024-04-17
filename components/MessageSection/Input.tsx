import classes from './Input.module.css';
import { IoSend } from 'react-icons/io5';
import { CgAttachment } from 'react-icons/cg';
import { FaMicrophone } from 'react-icons/fa';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdPhoto } from 'react-icons/md';
import { Message } from '@/model/Message';
import { useSession } from 'next-auth/react';
import { IoIosArrowBack } from 'react-icons/io';
import { ShowChatsContext } from '@/store/ShowChatsContext';

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function Input({ setMessages }: Props) {
  const [val, setVal] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { data: session } = useSession();
  const showChatsCtx = useContext(ShowChatsContext);

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';

    textAreaRef.current.style.height =
      textAreaRef.current.scrollHeight <= 200
        ? textAreaRef.current.scrollHeight + 'px'
        : '200px';
  };

  useEffect(resizeTextArea, [val]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setVal(e.target.value);

  const enterHandler = (
    e: React.KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!val || val.trim().length === 0) return;

      const message = {
        id: Date.now().toString(),
        date: Date.now(),
        from: session?.user.id!,
        message: val,
      };
      setMessages((prev) => [...prev, message]);
      setVal('');
    }
  };

  const onSendHandler = () => {
    enterHandler(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
      })
    );
  };

  return (
    <div className={classes.container}>
      <button
        type="button"
        className={classes.back}
        onClick={() => showChatsCtx.setShowChats(true)}
      >
        <IoIosArrowBack />
      </button>
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
        <IoSend className={classes.icon} onClick={onSendHandler} />
      </div>
    </div>
  );
}

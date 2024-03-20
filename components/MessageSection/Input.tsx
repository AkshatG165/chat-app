import classes from './Input.module.css';
import { IoSend } from 'react-icons/io5';
import { CgAttachment } from 'react-icons/cg';
import { FaMicrophone } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { MdPhoto } from 'react-icons/md';

export default function Input() {
  const [val, setVal] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  useEffect(resizeTextArea, [val]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value);
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

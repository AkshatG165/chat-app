import classes from './Header.module.css';
import { IoCall } from 'react-icons/io5';
import { FaVideo } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Link from 'next/link';
import { useContext } from 'react';
import { ChatContext } from '@/store/ChatContext';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const chatCtx = useContext(ChatContext);

  const img =
    session?.user.id === chatCtx.selectedChat?.user1
      ? chatCtx.selectedChat?.user2Img
      : chatCtx.selectedChat?.user1Img;
  const name =
    session?.user.id === chatCtx.selectedChat?.user1
      ? chatCtx.selectedChat?.user2Name
      : chatCtx.selectedChat?.user1Name;

  return (
    <div className={classes.header}>
      <div className={classes.left}>
        <img
          src={img}
          alt="profile-pic"
          height={50}
          width={50}
          className={classes.profilepic}
        />
        <div className={classes.title}>
          <p className={classes.name}>{name}</p>
          {/* {user.online && <p className={classes.status}>Online</p>} */}
        </div>
      </div>
      <div className={classes.actions}>
        <Link href="#">
          <IoCall className={classes.icon} />
        </Link>
        <Link href="#">
          <FaVideo className={classes.icon} />
        </Link>
        <Link href="#">
          <BsThreeDots className={classes.icon} />
        </Link>
      </div>
    </div>
  );
}

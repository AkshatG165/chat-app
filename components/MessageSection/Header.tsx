import classes from './Header.module.css';
import profilePic from '../../public/pic.jpg';
import { IoCall } from 'react-icons/io5';
import { FaVideo } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';

const user = {
  name: 'Akshat Gupta',
  profilePic,
  online: true,
};

export default function Header() {
  return (
    <div className={classes.header}>
      <div className={classes.left}>
        <Image
          src={user.profilePic}
          alt="profile-pic"
          height={50}
          width={50}
          className={classes.profilepic}
        />
        <div className={classes.title}>
          <p className={classes.name}>{user.name}</p>
          {user.online && <p className={classes.status}>Online</p>}
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

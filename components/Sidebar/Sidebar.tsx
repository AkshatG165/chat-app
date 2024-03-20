import Link from 'next/link';
import Card from '../UI/Card';
import classes from './Sidebar.module.css';
import { CgProfile } from 'react-icons/cg';
import { IoSettingsSharp } from 'react-icons/io5';
import { BiSolidMessageDetail } from 'react-icons/bi';
import { TiGroup } from 'react-icons/ti';
import { MdCall } from 'react-icons/md';

export default function Sidebar() {
  return (
    <div className={classes.card}>
      <div>
        <Link href="#">
          <CgProfile className={classes.icon} />
        </Link>
      </div>
      <div className={classes.nav}>
        <Link href="#">
          <BiSolidMessageDetail className={classes.icon} />
          <p>Messages</p>
        </Link>
        <Link href="#">
          <TiGroup className={classes.icon} />
          <p>Groups</p>
        </Link>
        <Link href="#">
          <MdCall className={classes.icon} />
          <p>Calls</p>
        </Link>
      </div>
      <div>
        <Link href="#">
          <IoSettingsSharp className={classes.icon} />
          <p>Settings</p>
        </Link>
      </div>
    </div>
  );
}

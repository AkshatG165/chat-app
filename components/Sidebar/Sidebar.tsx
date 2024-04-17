import Link from 'next/link';
import classes from './Sidebar.module.css';
import { IoIosCall, IoIosLogOut } from 'react-icons/io';
import { signOut, useSession } from 'next-auth/react';
import { TbMessage } from 'react-icons/tb';
import { HiMiniUserGroup } from 'react-icons/hi2';
import defaultUser from '../../public/defaultUser.jpg';
import Image from 'next/image';

export default function Sidebar({ className }: { className?: string }) {
  const { data: session } = useSession();

  const logoutHandler = async () => await signOut();

  return (
    <div className={classes.card + ' ' + className}>
      <div className={classes.nav}>
        <Link href="#">
          <Image
            src={session?.user.image ? session.user.image : defaultUser}
            alt="profile-pic"
            height={45}
            width={45}
            className={classes.profilImg}
          />

          {session && <p>{session.user.firstName}</p>}
        </Link>
        <Link href="/">
          <TbMessage className={classes.icon} />
          <p>Messages</p>
        </Link>
        <Link href="#">
          <HiMiniUserGroup className={classes.icon} />
          <p>Groups</p>
        </Link>
        <Link href="#">
          <IoIosCall className={classes.icon} />
          <p>Calls</p>
        </Link>
      </div>
      <div>
        <button
          type="button"
          className={classes.logout}
          onClick={logoutHandler}
        >
          <IoIosLogOut className={classes.icon} />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
}

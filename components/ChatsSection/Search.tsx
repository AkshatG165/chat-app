import classes from './Search.module.css';
import { GoSearch } from 'react-icons/go';

export default function Search() {
  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <GoSearch className={classes.icon} />
        <input id="search" type="text" name="search" placeholder="Search" />
      </div>
    </div>
  );
}

import { useContext, useEffect } from 'react';
import classes from './Search.module.css';
import { GoSearch } from 'react-icons/go';
import { SearchContext } from '@/store/contexts/SearchContext';

export default function Search() {
  const searchCtx = useContext(SearchContext);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    searchCtx.setSearchTerm(e.currentTarget.value);

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <GoSearch className={classes.icon} />
        <input
          id="search"
          type="text"
          name="search"
          placeholder="Search for users"
          onChange={inputHandler}
          value={searchCtx.searchTerm}
        />
      </div>
    </div>
  );
}

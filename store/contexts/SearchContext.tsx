import { createContext, useState } from 'react';

type Context = {
  searchTerm: string;
  setSearchTerm: (input: string) => void;
};

type Props = {
  children: React.ReactNode;
};

export const SearchContext = createContext<Context>({
  searchTerm: '',
  setSearchTerm: (input: string) => {},
});

export default function SearchContextProvider({ children }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const setInput = (input: string) => setSearchTerm(input);

  return (
    <SearchContext.Provider
      value={{ searchTerm: searchTerm, setSearchTerm: setInput }}
    >
      {children}
    </SearchContext.Provider>
  );
}

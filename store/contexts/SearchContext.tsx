import { createContext, useState } from 'react';

type Context = {
  searchTerm: string | null;
  setSearchTerm: (input: string) => void;
};

type Props = {
  children: React.ReactNode;
};

export const SearchContext = createContext<Context>({
  searchTerm: null,
  setSearchTerm: (input: string) => {},
});

export default function SearchContextProvider({ children }: Props) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const setInput = (input: string) => setSearchTerm(input);

  return (
    <SearchContext.Provider
      value={{ searchTerm: searchTerm, setSearchTerm: setInput }}
    >
      {children}
    </SearchContext.Provider>
  );
}

import React, { createContext, useState } from 'react';

type Context = {
  showChats: boolean;
  setShowChats: (input: boolean) => void;
};

type Props = {
  children: React.ReactNode;
};

export const ShowChatsContext = createContext<Context>({
  showChats: false,
  setShowChats: (input: boolean) => {},
});

export default function ShowChatsContextProvider({ children }: Props) {
  const [showChats, setShowChats] = useState(false);

  return (
    <ShowChatsContext.Provider value={{ showChats, setShowChats }}>
      {children}
    </ShowChatsContext.Provider>
  );
}

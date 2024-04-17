import React, { createContext, useState } from 'react';

type Context = {
  showChats: boolean;
  setShowChats: (input: boolean) => void;
};

type Props = {
  children: React.ReactNode;
};

export const ShowChatsContext = createContext<Context>({
  showChats: true,
  setShowChats: (input: boolean) => {},
});

export default function ShowChatsContextProvider({ children }: Props) {
  const [showChats, setShowChats] = useState(true);

  return (
    <ShowChatsContext.Provider value={{ showChats, setShowChats }}>
      {children}
    </ShowChatsContext.Provider>
  );
}

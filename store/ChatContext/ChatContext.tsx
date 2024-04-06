import React, { createContext, useState } from 'react';
import { Chat } from '@/model/Chat';
import { Message } from '@/model/Message';

export type State = {
  chat: Chat;
  message: Message;
};

type Context = {
  chats: State[] | undefined;
  setChats: React.Dispatch<React.SetStateAction<State[] | undefined>>;
};

type Props = {
  children: React.ReactNode;
};

export const ChatContext = createContext<Context>({
  chats: undefined,
  setChats: React.Dispatch<React.SetStateAction<State[] | undefined>>,
});

export default function ChatContextProvider({ children }: Props) {
  const [chats, setChats] = useState<State[]>();

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
}

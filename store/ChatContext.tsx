import React, { createContext, useState } from 'react';
import { Chat } from '@/model/Chat';

type Context = {
  selectedChat: Chat | undefined;
  setSelectedChat: (chat: Chat) => void;
};

type Props = {
  children: React.ReactNode;
};

export const ChatContext = createContext<Context>({
  selectedChat: undefined,
  setSelectedChat: (chat: Chat) => {},
});

export default function ChatContextProvider({ children }: Props) {
  const [selectedChat, setSelectedChat] = useState<Chat>();

  const handleChatSelect = (chat: Chat) => setSelectedChat(chat);

  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat: handleChatSelect }}
    >
      {children}
    </ChatContext.Provider>
  );
}

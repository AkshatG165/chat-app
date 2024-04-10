import { Message } from './Message';

export class Chat {
  id: string;
  user1: string;
  user1Name: string;
  user2: string;
  user2Name: string;
  user1Img: string;
  user2Img: string;
  lastMessage: Message | undefined;

  constructor(
    id: string,
    user1: string,
    user1Name: string,
    user2: string,
    user2Name: string,
    user1Img?: string,
    user2Img?: string,
    lastMessage?: Message
  ) {
    this.id = id;
    this.user1 = user1;
    this.user1Name = user1Name;
    this.user2 = user2;
    this.user2Name = user2Name;
    this.user1Img = user1Img ? user1Img : '';
    this.user2Img = user2Img ? user2Img : '';
    this.lastMessage = lastMessage;
  }
}

export class Message {
  id: string;
  date: number;
  from: string;
  message: string;

  constructor(id: string, date: number, from: string, message: string) {
    this.id = id;
    this.date = date;
    this.from = from;
    this.message = message;
  }
}

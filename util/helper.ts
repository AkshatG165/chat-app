import { hash, compare } from 'bcryptjs';

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const timeArr = date.toLocaleTimeString().split(':');
  return `${timeArr[0]}:${timeArr[1]} ${timeArr[2].split(' ')[1]}`;
}

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function checkPassword(
  enteredPassword: string,
  storedPassword: string
) {
  const isValid = await compare(enteredPassword, storedPassword);
  return isValid;
}

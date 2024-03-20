export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatTime(date: Date) {
  const timeArr = date.toLocaleTimeString().split(':');
  return `${timeArr[0]}:${timeArr[1]} ${timeArr[2].split(' ')[1]}`;
}

export function setTimezone(date: Date) {
  const d = new Date(date);
  return d.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' });
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function defaultBoardName(date: Date): string {
  const month = MONTHS[date.getMonth()] ?? '';

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

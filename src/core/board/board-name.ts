const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function defaultBoardName(date: Date): string {
  const month = MONTHS[date.getMonth()] ?? '';

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

export function fileSafeName(name: string): string {
  const cleaned = name
    .replace(/[^\p{L}\p{N} _-]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

  return cleaned.length === 0 ? 'board' : cleaned;
}

import { defaultBoardName } from '@/core/board/board-name';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
}

export function modifiedLabel(modifiedAt: string, now: Date): string {
  const date = new Date(modifiedAt);
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MINUTE), 'minute');
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), 'hour');
  if (elapsed < WEEK) return plural(Math.floor(elapsed / DAY), 'day');

  return defaultBoardName(date);
}

import { describe, expect, it } from 'vitest';
import { modifiedLabel } from '@/core/board/board-date';

const NOW = new Date(2026, 7, 24, 12, 0, 0);

function ago(milliseconds: number): string {
  return new Date(NOW.getTime() - milliseconds).toISOString();
}

describe('modified label', () => {
  it('reads relative inside the last week', () => {
    expect(modifiedLabel(ago(5_000), NOW)).toBe('just now');
    expect(modifiedLabel(ago(60_000), NOW)).toBe('1 minute ago');
    expect(modifiedLabel(ago(90 * 60_000), NOW)).toBe('1 hour ago');
    expect(modifiedLabel(ago(50 * 60 * 60_000), NOW)).toBe('2 days ago');
  });

  it('falls back to the date beyond a week', () => {
    expect(modifiedLabel(new Date(2026, 6, 1, 9, 0, 0).toISOString(), NOW)).toBe('1 Jul 2026');
  });
});

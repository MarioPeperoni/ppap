import { describe, expect, it } from 'vitest';
import { defaultBoardName } from '@/core/board/board-name';

describe('board name', () => {
  it('names a board after the day it was created', () => {
    expect(defaultBoardName(new Date(2026, 7, 23))).toBe('23 Aug 2026');
    expect(defaultBoardName(new Date(2027, 0, 1))).toBe('1 Jan 2027');
  });
});

import { describe, expect, it } from 'vitest';
import type { BoardFile } from '@/types';
import { parseBoardFile, parseBoardMeta } from '@/validation/board-file.validator';

const FILE: BoardFile = {
  meta: {
    format: 'ppap',
    version: 1,
    id: '0f9d3e2a-1c4b-4a7d-9e8f-2b6c5d4a3e10',
    name: 'sprint planning',
    createdAt: '2026-08-24T09:00:00.000Z',
    modifiedAt: '2026-08-24T10:30:00.000Z',
    folderId: null,
  },
  content: {
    gridVisible: true,
    camera: { x: -120, y: 40, zoom: 1.5 },
    elements: [
      {
        id: 'a1',
        createdAt: 1_756_000_000_000,
        type: 'stroke',
        points: [
          [0, 0, 0.5],
          [10, 12, 0.6],
        ],
        color: 'blue',
        size: 'm',
        scale: 1,
      },
    ],
  },
};

function clone(): BoardFile {
  return JSON.parse(JSON.stringify(FILE)) as BoardFile;
}

describe('board file validation', () => {
  it('round-trips a board through JSON', () => {
    expect(parseBoardFile(JSON.parse(JSON.stringify(FILE)))).toEqual(FILE);
  });

  it('rejects a foreign format', () => {
    const broken = clone();
    expect(() => parseBoardMeta({ ...broken.meta, format: 'other' })).toThrow('Not a ppap board');
  });

  it('rejects a version it cannot read', () => {
    const broken = clone();
    expect(() => parseBoardMeta({ ...broken.meta, version: 2 })).toThrow('Unsupported board');
  });

  it('rejects a malformed id', () => {
    const broken = clone();
    expect(() => parseBoardMeta({ ...broken.meta, id: 'not-a-uuid' })).toThrow('malformed');
  });

  it('rejects an element with a missing field', () => {
    const broken = clone();
    const [stroke] = broken.content.elements;
    if (stroke === undefined || stroke.type !== 'stroke') throw new Error('fixture');

    expect(() =>
      parseBoardFile({
        meta: broken.meta,
        content: { ...broken.content, elements: [{ ...stroke, color: undefined }] },
      }),
    ).toThrow('Stroke color');
  });

  it('rejects a point that is not numeric', () => {
    const broken = clone();
    const [stroke] = broken.content.elements;
    if (stroke === undefined || stroke.type !== 'stroke') throw new Error('fixture');

    expect(() =>
      parseBoardFile({
        meta: broken.meta,
        content: { ...broken.content, elements: [{ ...stroke, points: [[0, 'x', 1]] }] },
      }),
    ).toThrow('Stroke point y');
  });
});

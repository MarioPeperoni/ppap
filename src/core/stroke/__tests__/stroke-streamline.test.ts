import { describe, expect, it } from 'vitest';
import { streamlinePoint } from '@/core/stroke/stroke-streamline';
import type { StrokePoint } from '@/types';

describe('streamline point', () => {
  it('keeps the first sample untouched', () => {
    const first: StrokePoint = [10, 20, 0.5];

    expect(streamlinePoint(undefined, first)).toBe(first);
  });

  it('pulls a sample halfway toward the previous one at the default factor', () => {
    expect(streamlinePoint([0, 0, 0.5], [10, 20, 0.7])).toEqual([5, 10, 0.7]);
  });

  it('passes the raw sample straight through when it is switched off', () => {
    expect(streamlinePoint([0, 0, 0.5], [10, 20, 0.7], 0)).toEqual([10, 20, 0.7]);
  });

  it('converges on the pointer over repeated samples', () => {
    let point: StrokePoint = [0, 0, 0.5];
    for (let index = 0; index < 12; index += 1) point = streamlinePoint(point, [100, 0, 0.5]);

    expect(point[0]).toBeGreaterThan(99.9);
  });
});

import { TOOL_COLORS, TOOL_SIZES } from '@/constants/tool.constants';
import { createStroke } from '@/core/element/element.factory';
import { appendPatch } from '@/core/scene/scene-patch';
import { commitPatch } from '@/renderer/commands/scene.command';
import type { ColorToken, Element, SizeToken, StrokePoint } from '@/types';

const SPREAD = 6000;
const POINTS_PER_STROKE = 12;

function pick<T>(values: readonly T[], fallback: T): T {
  return values[Math.floor(Math.random() * values.length)] ?? fallback;
}

function randomStroke(): Element {
  const originX = (Math.random() - 0.5) * SPREAD;
  const originY = (Math.random() - 0.5) * SPREAD;
  const points: StrokePoint[] = [];

  for (let index = 0; index < POINTS_PER_STROKE; index += 1) {
    points.push([
      originX + Math.cos(index / 2) * index * 4,
      originY + Math.sin(index / 3) * index * 4,
      0.4 + Math.random() * 0.4,
    ]);
  }

  const color: ColorToken = pick(TOOL_COLORS, 'ink');
  const size: SizeToken = pick(TOOL_SIZES, 'm');

  return createStroke(points, color, size);
}

function seed(count: number): void {
  const elements: Element[] = [];
  for (let index = 0; index < count; index += 1) elements.push(randomStroke());

  commitPatch(`seed ${count}`, appendPatch(elements));
}

export function installDevTools(): void {
  if (!import.meta.env.DEV) return;

  window.__ppapDev = { seed };
}

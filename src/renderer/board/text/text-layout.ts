import { cssFont, lineHeight, minWidth, textLines } from '@/core/text/text-font';
import type { FontToken, SizeToken, TextLayout } from '@/types';

const surface = document.createElement('canvas');

function measuringContext(): CanvasRenderingContext2D {
  const ctx = surface.getContext('2d');
  if (ctx === null) throw new Error('Canvas 2D context unavailable');

  return ctx;
}

/** The box the text occupies and where its first baseline sits inside that box. */
export function layoutText(
  text: string,
  size: SizeToken,
  scale: number,
  font: FontToken,
): TextLayout {
  const ctx = measuringContext();
  ctx.font = cssFont(size, scale, font);

  const lines = textLines(text);
  const step = lineHeight(size, scale);
  const probe = ctx.measureText(lines[0] ?? '');
  let width = minWidth(size, scale);

  for (const line of lines) width = Math.max(width, ctx.measureText(line).width);

  const leading = (step - probe.fontBoundingBoxAscent - probe.fontBoundingBoxDescent) / 2;

  return {
    lines,
    width,
    height: lines.length * step,
    lineHeight: step,
    baseline: leading + probe.fontBoundingBoxAscent,
  };
}

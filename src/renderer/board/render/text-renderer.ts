import { strokeColor } from '@/core/color/stroke-color';
import { cssFont } from '@/core/text/text-font';
import { layoutText } from '@/renderer/board/text/text-layout';
import type { Palette, TextElement } from '@/types';

export function drawText(
  ctx: CanvasRenderingContext2D,
  element: TextElement,
  colors: Palette,
): void {
  const layout = layoutText(element.text, element.size, element.scale, element.font);

  ctx.font = cssFont(element.size, element.scale, element.font);
  ctx.fillStyle = strokeColor(element.color, colors);
  ctx.textBaseline = 'alphabetic';

  for (const [index, line] of layout.lines.entries()) {
    ctx.fillText(line, element.x, element.y + layout.baseline + index * layout.lineHeight);
  }
}

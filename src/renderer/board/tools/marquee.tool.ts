import { MarqueeRegion } from '@/renderer/board/selection/marquee-region';
import { SelectionTool } from '@/renderer/board/tools/selection.tool';

export class MarqueeTool extends SelectionTool {
  constructor() {
    super('marquee', 'Marquee', ['v', '4'], new MarqueeRegion());
  }
}

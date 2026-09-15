import { MarqueeRegion } from '@/renderer/board/selection/marquee-region';
import { SelectionTool } from '@/renderer/board/tools/selection.tool';

export class PointerTool extends SelectionTool {
  constructor() {
    super('pointer', 'Pointer', 'default', new MarqueeRegion());
  }
}

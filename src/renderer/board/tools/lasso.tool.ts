import { LassoRegion } from '@/renderer/board/selection/lasso-region';
import { SelectionTool } from '@/renderer/board/tools/selection.tool';

export class LassoTool extends SelectionTool {
  constructor() {
    super('lasso', 'Lasso', new LassoRegion());
  }
}

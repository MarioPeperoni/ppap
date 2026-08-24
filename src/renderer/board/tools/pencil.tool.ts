import { StrokeTool } from '@/renderer/board/tools/stroke.tool';

export class PencilTool extends StrokeTool {
  constructor() {
    super('pencil', 'Pencil', ['n', '2'], 'pencil');
  }
}

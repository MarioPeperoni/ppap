import { StrokeTool } from '@/renderer/board/tools/stroke.tool';

export class PenTool extends StrokeTool {
  constructor() {
    super('pen', 'Pen', ['p', '1'], 'pen');
  }
}

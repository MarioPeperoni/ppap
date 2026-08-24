import { EraserTool } from '@/renderer/board/tools/eraser.tool';
import { HandTool } from '@/renderer/board/tools/hand.tool';
import { PenTool } from '@/renderer/board/tools/pen.tool';
import type { Tool, ToolId } from '@/types';

const TOOLS: Record<ToolId, Tool> = {
  pen: new PenTool(),
  eraser: new EraserTool(),
  hand: new HandTool(),
};

export const TOOL_IDS: readonly ToolId[] = ['pen', 'eraser', 'hand'];

export function getTool(id: ToolId): Tool {
  return TOOLS[id];
}

export function findToolByKey(key: string): ToolId | undefined {
  return TOOL_IDS.find((id) => TOOLS[id].keys.includes(key));
}

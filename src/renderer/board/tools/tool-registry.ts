import { SELECTION_TOOLS, TOOL_IDS } from '@/constants/tool.constants';
import { EraserTool } from '@/renderer/board/tools/eraser.tool';
import { HandTool } from '@/renderer/board/tools/hand.tool';
import { LassoTool } from '@/renderer/board/tools/lasso.tool';
import { MarqueeTool } from '@/renderer/board/tools/marquee.tool';
import { PenTool } from '@/renderer/board/tools/pen.tool';
import type { Tool, ToolId } from '@/types';

const TOOLS: Record<ToolId, Tool> = {
  pen: new PenTool(),
  eraser: new EraserTool(),
  marquee: new MarqueeTool(),
  lasso: new LassoTool(),
  hand: new HandTool(),
};

export function getTool(id: ToolId): Tool {
  return TOOLS[id];
}

export function findToolByKey(key: string): ToolId | undefined {
  return TOOL_IDS.find((id) => TOOLS[id].keys.includes(key));
}

export function isSelectionTool(id: ToolId): boolean {
  return SELECTION_TOOLS.includes(id);
}

import type { ColorToken, SizeToken, ToolId } from '@/types';

export const TOOL_IDS: readonly ToolId[] = ['pen', 'pencil', 'eraser', 'marquee', 'lasso', 'hand'];
export const TOOL_COLORS: readonly ColorToken[] = [
  'ink',
  'blue',
  'red',
  'green',
  'violet',
  'orange',
];
export const TOOL_SIZES: readonly SizeToken[] = ['s', 'm', 'l'];
export const ERASER_RADII: readonly number[] = [6, 12, 24, 48];
export const SELECTION_TOOLS: readonly ToolId[] = ['marquee', 'lasso'];
export const INK_TOOLS: readonly ToolId[] = ['pen', 'pencil'];

export const DEFAULT_TOOL: ToolId = 'pen';
export const DEFAULT_COLOR: ColorToken = 'ink';
export const DEFAULT_SIZE: SizeToken = 'm';
export const DEFAULT_ERASER_RADIUS = 12;
export const DEFAULT_SELECTION_TOOL: ToolId = 'marquee';

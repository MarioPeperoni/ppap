import type { ColorToken, SizeToken, ToolId } from '@/types';

export const TOOL_IDS: readonly ToolId[] = [
  'pen',
  'pencil',
  'text',
  'eraser',
  'marquee',
  'lasso',
  'hand',
];
export const TOOL_COLORS: readonly ColorToken[] = [
  'ink',
  'blue',
  'red',
  'green',
  'violet',
  'orange',
];
export const TOOL_SIZES: readonly SizeToken[] = ['s', 'm', 'l', 'xl'];
export const ERASER_RADII: readonly number[] = [6, 12, 24, 48];
export const SIZE_LABELS: Record<SizeToken, string> = {
  s: 'Thin',
  m: 'Medium',
  l: 'Thick',
  xl: 'Extra thick',
};

export const SELECTION_TOOLS: readonly ToolId[] = ['marquee', 'lasso'];
export const INK_TOOLS: readonly ToolId[] = ['pen', 'pencil', 'text'];

export const DEFAULT_TOOL: ToolId = 'pen';
export const DEFAULT_COLOR: ColorToken = 'ink';
export const DEFAULT_SIZE: SizeToken = 'm';
export const DEFAULT_ERASER_RADIUS = 12;
export const DEFAULT_SELECTION_TOOL: ToolId = 'marquee';

import type { ColorToken, SizeToken, ToolId } from '@/types';

export const TOOL_COLORS: readonly ColorToken[] = ['ink', 'blue', 'red', 'green'];
export const TOOL_SIZES: readonly SizeToken[] = ['s', 'm', 'l'];
export const ERASER_RADII: readonly number[] = [6, 12, 24, 48];

export const DEFAULT_TOOL: ToolId = 'pen';
export const DEFAULT_COLOR: ColorToken = 'ink';
export const DEFAULT_SIZE: SizeToken = 'm';
export const DEFAULT_ERASER_RADIUS = 12;

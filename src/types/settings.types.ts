import type { HexColor, StrokeColor } from './color.types';
import type { SizeToken } from './element.types';
import type { SortOrder } from './library.types';
import type { Theme } from './theme.types';
import type { ToolId } from './tool.types';

export interface Settings {
  theme: Theme;
  tool: ToolId;
  color: StrokeColor;
  customColors: HexColor[];
  penSize: SizeToken;
  eraserRadius: number;
  sortOrder: SortOrder;
  lastSeenVersion: string;
}

export type SettingsPatch = Partial<Settings>;

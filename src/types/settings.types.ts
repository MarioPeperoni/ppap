import type { ColorToken, SizeToken } from './element.types';
import type { SortOrder } from './library.types';
import type { Theme } from './theme.types';
import type { ToolId } from './tool.types';

export interface Settings {
  theme: Theme;
  tool: ToolId;
  color: ColorToken;
  penSize: SizeToken;
  eraserRadius: number;
  sortOrder: SortOrder;
}

export type SettingsPatch = Partial<Settings>;

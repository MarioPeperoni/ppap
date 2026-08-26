import type { WheelAction } from './camera.types';
import type { SavedPalette, StrokeColor } from './color.types';
import type { SizeToken } from './element.types';
import type { Keymap } from './keymap.types';
import type { SortOrder } from './library.types';
import type { Theme } from './theme.types';
import type { ToolId } from './tool.types';

export interface Settings {
  theme: Theme;
  tool: ToolId;
  color: StrokeColor;
  swapColor: StrokeColor | null;
  savedPalettes: SavedPalette[];
  activePaletteId: string | null;
  penSize: SizeToken;
  eraserRadius: number;
  wheelAction: WheelAction;
  keymap: Keymap;
  sortOrder: SortOrder;
  lastSeenVersion: string;
}

export type SettingsPatch = Partial<Settings>;

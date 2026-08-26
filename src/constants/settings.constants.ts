import { DEFAULT_WHEEL_ACTION } from '@/constants/camera.constants';
import { DEFAULT_KEYMAP } from '@/constants/keymap.constants';
import {
  DEFAULT_COLOR,
  DEFAULT_ERASER_RADIUS,
  DEFAULT_SIZE,
  DEFAULT_TOOL,
} from '@/constants/tool.constants';
import type { Settings, SortOrder } from '@/types';

export const SORT_ORDERS: readonly SortOrder[] = ['modified', 'name', 'created'];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  tool: DEFAULT_TOOL,
  color: DEFAULT_COLOR,
  swapColor: null,
  customColors: [],
  penSize: DEFAULT_SIZE,
  eraserRadius: DEFAULT_ERASER_RADIUS,
  wheelAction: DEFAULT_WHEEL_ACTION,
  keymap: DEFAULT_KEYMAP,
  sortOrder: 'modified',
  lastSeenVersion: '',
};

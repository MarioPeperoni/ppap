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
  penSize: DEFAULT_SIZE,
  eraserRadius: DEFAULT_ERASER_RADIUS,
  sortOrder: 'modified',
};

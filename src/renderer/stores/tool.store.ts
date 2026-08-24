import { create } from 'zustand';
import {
  DEFAULT_COLOR,
  DEFAULT_ERASER_RADIUS,
  DEFAULT_SIZE,
  DEFAULT_TOOL,
  ERASER_RADII,
  TOOL_COLORS,
  TOOL_SIZES,
} from '@/constants/tool.constants';
import type { ColorToken, Settings, SizeToken, ToolId } from '@/types';

function stepped<T>(values: readonly T[], current: T, direction: number, fallback: T): T {
  const index = values.indexOf(current);
  if (index === -1) return fallback;

  return values[Math.min(values.length - 1, Math.max(0, index + direction))] ?? fallback;
}

function cycled<T>(values: readonly T[], current: T, direction: number, fallback: T): T {
  const index = values.indexOf(current);
  if (index === -1) return fallback;

  return values[(index + direction + values.length) % values.length] ?? fallback;
}

interface ToolStore {
  tool: ToolId;
  color: ColorToken;
  penSize: SizeToken;
  eraserRadius: number;
  adopt: (settings: Settings) => void;
  setTool: (tool: ToolId) => void;
  setColor: (color: ColorToken) => void;
  cycleColor: (direction: number) => void;
  setPenSize: (size: SizeToken) => void;
  setEraserRadius: (radius: number) => void;
  stepWidth: (direction: number) => void;
}

export const useToolStore = create<ToolStore>()((set, get) => ({
  tool: DEFAULT_TOOL,
  color: DEFAULT_COLOR,
  penSize: DEFAULT_SIZE,
  eraserRadius: DEFAULT_ERASER_RADIUS,

  adopt: ({ tool, color, penSize, eraserRadius }) => {
    set({ tool, color, penSize, eraserRadius });
  },

  setTool: (tool) => {
    set({ tool });
  },

  setColor: (color) => {
    set({ color });
  },

  cycleColor: (direction) => {
    set({ color: cycled(TOOL_COLORS, get().color, direction, DEFAULT_COLOR) });
  },

  setPenSize: (penSize) => {
    set({ penSize });
  },

  setEraserRadius: (eraserRadius) => {
    set({ eraserRadius });
  },

  stepWidth: (direction) => {
    const state = get();

    if (state.tool === 'eraser') {
      set({
        eraserRadius: stepped(ERASER_RADII, state.eraserRadius, direction, DEFAULT_ERASER_RADIUS),
      });
      return;
    }

    set({ penSize: stepped(TOOL_SIZES, state.penSize, direction, DEFAULT_SIZE) });
  },
}));

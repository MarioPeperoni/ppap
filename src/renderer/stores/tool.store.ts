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
import type { ColorPair, HexColor, Settings, SizeToken, StrokeColor, ToolId } from '@/types';

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

/** Picking the pinned colour swaps the pair, so the two never collapse into one. */
function picked(pair: ColorPair, next: StrokeColor): ColorPair {
  if (next === pair.swapColor) return { color: next, swapColor: pair.color };

  return { color: next, swapColor: pair.swapColor };
}

interface ToolStore extends ColorPair {
  tool: ToolId;
  activePaletteId: string | null;
  penSize: SizeToken;
  eraserRadius: number;
  adopt: (settings: Settings) => void;
  setTool: (tool: ToolId) => void;
  setColor: (color: StrokeColor) => void;
  pairColor: (color: StrokeColor) => void;
  swapColors: () => void;
  cycleColor: (direction: number, colors: readonly HexColor[]) => void;
  carryPalette: (id: string | null) => void;
  setPenSize: (size: SizeToken) => void;
  setEraserRadius: (radius: number) => void;
  stepWidth: (direction: number) => void;
}

export const useToolStore = create<ToolStore>()((set, get) => ({
  tool: DEFAULT_TOOL,
  color: DEFAULT_COLOR,
  swapColor: null,
  activePaletteId: null,
  penSize: DEFAULT_SIZE,
  eraserRadius: DEFAULT_ERASER_RADIUS,

  adopt: ({ tool, color, swapColor, activePaletteId, penSize, eraserRadius }) => {
    set({ tool, color, swapColor, activePaletteId, penSize, eraserRadius });
  },

  setTool: (tool) => {
    set({ tool });
  },

  setColor: (color) => {
    set(picked(get(), color));
  },

  pairColor: (color) => {
    const state = get();
    if (color === state.color) return;

    set({ swapColor: state.swapColor === color ? null : color });
  },

  swapColors: () => {
    const { color, swapColor } = get();
    if (swapColor === null) return;

    set({ color: swapColor, swapColor: color });
  },

  cycleColor: (direction, colors) => {
    const state = get();
    const next = cycled([...TOOL_COLORS, ...colors], state.color, direction, DEFAULT_COLOR);

    set(picked(state, next));
  },

  carryPalette: (activePaletteId) => {
    set({ activePaletteId });
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

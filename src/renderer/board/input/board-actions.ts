import { paletteOf } from '@/core/color/palettes';
import { deleteSelection } from '@/renderer/board/selection/selection-actions';
import { usePaletteStore } from '@/renderer/stores/palette.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { ActionId, ToolId } from '@/types';

function selectTool(id: ToolId): () => void {
  return () => {
    const tools = useToolStore.getState();
    const ui = useUiStore.getState();

    if (tools.tool === id) {
      ui.togglePopover(id);
      return;
    }

    tools.setTool(id);
    ui.setPopover(null);
  };
}

function cycleColor(direction: number): () => void {
  return () => {
    const { palettes } = usePaletteStore.getState();
    const carried = paletteOf(palettes, useToolStore.getState().activePaletteId);

    useToolStore.getState().cycleColor(direction, carried?.colors ?? []);
  };
}

function stepWidth(direction: number): () => void {
  return () => {
    useToolStore.getState().stepWidth(direction);
  };
}

export const BOARD_ACTIONS: Record<ActionId, () => void> = {
  'tool.pen': selectTool('pen'),
  'tool.pencil': selectTool('pencil'),
  'tool.eraser': selectTool('eraser'),
  'tool.marquee': selectTool('marquee'),
  'tool.lasso': selectTool('lasso'),
  'tool.hand': selectTool('hand'),
  'color.next': cycleColor(1),
  'color.previous': cycleColor(-1),
  'color.swap': () => {
    useToolStore.getState().swapColors();
  },
  'width.decrease': stepWidth(-1),
  'width.increase': stepWidth(1),
  'selection.delete': deleteSelection,
};

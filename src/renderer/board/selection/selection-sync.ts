import { isSelectionTool } from '@/renderer/board/tools/tool-registry';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { watchStore } from '@/renderer/stores/watch-store';
import type { ToolId } from '@/types';

/** A selection only exists while a tool can show it. */
export class SelectionSync {
  private readonly unwatch: () => void;

  constructor() {
    this.unwatch = watchStore(useToolStore, (state) => state.tool, this.onToolChange);
  }

  destroy(): void {
    this.unwatch();
  }

  private readonly onToolChange = (tool: ToolId): void => {
    if (isSelectionTool(tool)) return;

    useBoardStore.getState().setSelection([]);
  };
}

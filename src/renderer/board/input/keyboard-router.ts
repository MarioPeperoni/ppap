import type { CameraController } from '@/renderer/board/camera-controller';
import { pasteAt } from '@/renderer/board/images/image-paste';
import { isTypingTarget } from '@/renderer/board/input/typing-target';
import {
  clearSelection,
  copySelection,
  cutSelection,
  deleteSelection,
  duplicateSelection,
  selectAll,
} from '@/renderer/board/selection/selection-actions';
import { findToolByKey } from '@/renderer/board/tools/tool-registry';
import { copySelectionImage } from '@/renderer/export/board-export';
import { autosave } from '@/renderer/persistence/autosave';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { BoardInputHandlers } from '@/types';

export class KeyboardRouter {
  private spaceHeld = false;

  constructor(
    private readonly camera: CameraController,
    private readonly handlers: BoardInputHandlers,
  ) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (isTypingTarget(event.target)) return;

    if (event.ctrlKey || event.metaKey) {
      this.handleShortcut(event);
      return;
    }

    this.handleKey(event);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== ' ') return;

    this.spaceHeld = false;
    this.handlers.setPanOverride(false);
  };

  private handleKey(event: KeyboardEvent): void {
    if (event.key === ' ') {
      if (this.spaceHeld) return;
      this.spaceHeld = true;
      this.handlers.setPanOverride(true);
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      this.handlers.cancelGesture();
      clearSelection();
      useUiStore.getState().setPopover(null);
      return;
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteSelection();
      return;
    }

    if (event.key === '[' || event.key === ']') {
      useToolStore.getState().stepWidth(event.key === ']' ? 1 : -1);
      return;
    }

    const key = event.key.toLowerCase();

    if (key === 'c') {
      useToolStore.getState().cycleColor(event.shiftKey ? -1 : 1);
      return;
    }

    this.selectTool(key);
  }

  private selectTool(key: string): void {
    const match = findToolByKey(key);
    if (match === undefined) return;

    const tools = useToolStore.getState();
    const ui = useUiStore.getState();

    if (tools.tool === match) {
      ui.togglePopover(match);
      return;
    }

    tools.setTool(match);
    ui.setPopover(null);
  }

  private handleShortcut(event: KeyboardEvent): void {
    const history = useHistoryStore.getState();

    switch (event.key.toLowerCase()) {
      case 'z':
        if (event.shiftKey) history.redo();
        else history.undo();
        break;
      case 'y':
        history.redo();
        break;
      case 'a':
        selectAll();
        break;
      case 'c':
        if (event.shiftKey) void copySelectionImage();
        else copySelection();
        break;
      case 's':
        void autosave.flush();
        break;
      case 'x':
        cutSelection();
        break;
      case 'v':
        void pasteAt(this.handlers.pointerBoard() ?? this.camera.boardCenter());
        break;
      case 'd':
        duplicateSelection();
        break;
      case 'g':
        useBoardStore.getState().toggleGrid();
        break;
      case '0':
        this.camera.resetZoom();
        break;
      case '1':
        this.camera.fitContent();
        break;
      case '=':
      case '+':
        this.camera.zoomStep(1);
        break;
      case '-':
      case '_':
        this.camera.zoomStep(-1);
        break;
      default:
        return;
    }

    event.preventDefault();
  }
}

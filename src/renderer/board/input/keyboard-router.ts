import { strokeFromEvent } from '@/core/keymap/key-stroke';
import { findAction } from '@/core/keymap/keymap-lookup';
import type { CameraController } from '@/renderer/board/camera-controller';
import { pasteAt } from '@/renderer/board/images/image-paste';
import { BOARD_ACTIONS } from '@/renderer/board/input/board-actions';
import { isTypingTarget } from '@/renderer/board/input/typing-target';
import {
  clearSelection,
  copySelection,
  cutSelection,
  duplicateSelection,
  selectAll,
} from '@/renderer/board/selection/selection-actions';
import { copySelectionImage } from '@/renderer/export/board-export';
import { autosave } from '@/renderer/persistence/autosave';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import { useKeymapStore } from '@/renderer/stores/keymap.store';
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
    if (this.handleFixedKey(event)) return;
    if (this.handleBoundKey(event)) return;

    if (event.ctrlKey || event.metaKey) this.handleShortcut(event);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== ' ') return;

    this.spaceHeld = false;
    this.handlers.setPanOverride(false);
  };

  private handleFixedKey(event: KeyboardEvent): boolean {
    if (event.key === ' ') {
      if (!this.spaceHeld) {
        this.spaceHeld = true;
        this.handlers.setPanOverride(true);
        event.preventDefault();
      }

      return true;
    }

    if (event.key !== 'Escape') return false;

    this.handlers.cancelGesture();
    clearSelection();
    useUiStore.getState().setPopover(null);

    return true;
  }

  private handleBoundKey(event: KeyboardEvent): boolean {
    const { keymap } = useKeymapStore.getState();
    const action = findAction(keymap, strokeFromEvent(event));
    if (action === undefined) return false;

    BOARD_ACTIONS[action]();
    event.preventDefault();

    return true;
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

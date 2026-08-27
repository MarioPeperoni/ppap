import { commitText, typeTextAt } from '@/renderer/board/text/text-draft';
import { useTextStore } from '@/renderer/stores/text.store';
import type { PointerSample, Tool } from '@/types';

export class TextTool implements Tool {
  readonly id = 'text';
  readonly label = 'Text';
  readonly cursor = 'text';
  readonly keepsFocus = true;

  onPointerDown(sample: PointerSample): void {
    const open = useTextStore.getState().draft;
    if (open !== null) commitText(open.id);

    typeTextAt(sample.board);
  }

  onPointerMove(): void {
    return;
  }

  onPointerUp(): void {
    return;
  }

  onCancel(): void {
    return;
  }

  drawOverlay(): void {
    return;
  }
}

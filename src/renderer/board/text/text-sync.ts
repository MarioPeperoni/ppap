import { commitOpenText } from '@/renderer/board/text/text-draft';
import { useToolStore } from '@/renderer/stores/tool.store';
import { watchStore } from '@/renderer/stores/watch-store';

/** Reaching for another tool settles what is being typed. */
export class TextSync {
  private readonly unwatch: () => void;

  constructor() {
    this.unwatch = watchStore(useToolStore, (state) => state.tool, commitOpenText);
  }

  destroy(): void {
    this.unwatch();
  }
}

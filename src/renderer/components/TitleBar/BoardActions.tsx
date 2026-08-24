import type { ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MoreHorizontal } from 'lucide-react';
import { exportBoardImage } from '@/renderer/export/board-export';
import { exportBoard } from '@/renderer/session/board-session';

const ITEM_CLASS =
  'w-full rounded-lg px-2.5 py-1.5 text-left text-[12px] text-ink/80 hover:bg-raised hover:text-ink';

export function BoardActions(): ReactElement {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Board actions"
          className="app-no-drag flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-ink"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={6}
          className="w-44 rounded-xl border border-line bg-surface p-1 shadow-lg"
        >
          <button
            type="button"
            className={ITEM_CLASS}
            onClick={() => {
              void exportBoard();
            }}
          >
            Export board
          </button>
          <button
            type="button"
            className={ITEM_CLASS}
            onClick={() => {
              void exportBoardImage();
            }}
          >
            Export PNG
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

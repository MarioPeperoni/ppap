import type { ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { deleteBoard } from '@/renderer/session/board-session';
import type { BoardMeta } from '@/types';

interface DeleteBoardDialogProps {
  board: BoardMeta | null;
  onClose: () => void;
}

export function DeleteBoardDialog({ board, onClose }: DeleteBoardDialogProps): ReactElement {
  return (
    <Dialog.Root
      open={board !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface p-5 shadow-xl">
          <Dialog.Title className="text-[13px] font-medium text-ink">Delete board</Dialog.Title>
          <Dialog.Description className="mt-2 text-[12px] text-muted">
            {board === null ? '' : `"${board.name}" and its drawing are removed for good.`}
          </Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className="rounded-lg px-3 py-1.5 text-[12px] text-muted transition-colors hover:bg-raised hover:text-ink">
              Cancel
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                if (board !== null) void deleteBoard(board.id);
                onClose();
              }}
              className="rounded-lg bg-red px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-red/85"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import type { ReactElement } from 'react';
import { Folder as FolderIcon } from 'lucide-react';
import { FOLDER_PREVIEW_COUNT } from '@/constants/folder.constants';
import { sortBoards } from '@/core/board/board-sort';
import { FolderPreviewCell } from '@/renderer/components/Library/FolderPreviewCell';
import type { BoardMeta } from '@/types';

interface FolderPreviewProps {
  boards: readonly BoardMeta[];
}

export function FolderPreview({ boards }: FolderPreviewProps): ReactElement {
  if (boards.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FolderIcon size={26} strokeWidth={1.5} />
      </div>
    );
  }

  const preview = sortBoards(boards, 'modified').slice(0, FOLDER_PREVIEW_COUNT);
  const blanks = [...Array(FOLDER_PREVIEW_COUNT - preview.length).keys()];

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
      {preview.map((board) => (
        <FolderPreviewCell key={board.id} board={board} />
      ))}
      {blanks.map((slot) => (
        <div key={slot} className="rounded-md bg-surface/40" />
      ))}
    </div>
  );
}

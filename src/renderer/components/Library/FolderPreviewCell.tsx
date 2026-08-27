import type { ReactElement } from 'react';
import { useBoardThumbnail } from '@/renderer/hooks/use-board-thumbnail';
import type { BoardMeta } from '@/types';

interface FolderPreviewCellProps {
  board: BoardMeta;
}

export function FolderPreviewCell({ board }: FolderPreviewCellProps): ReactElement {
  const thumbnail = useBoardThumbnail(board.id, board.modifiedAt);

  return (
    <div className="overflow-hidden rounded-md bg-surface">
      {thumbnail === null ? null : (
        <img src={thumbnail} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  );
}

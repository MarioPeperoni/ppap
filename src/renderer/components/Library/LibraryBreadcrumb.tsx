import type { ReactElement } from 'react';
import { ChevronRight } from 'lucide-react';
import { useBoardDrop } from '@/renderer/hooks/use-board-drop';
import { fileBoard } from '@/renderer/session/folder-session';
import { useFolderStore } from '@/renderer/stores/folder.store';
import type { Folder } from '@/types';

interface LibraryBreadcrumbProps {
  folder: Folder;
}

export function LibraryBreadcrumb({ folder }: LibraryBreadcrumbProps): ReactElement {
  const open = useFolderStore((state) => state.open);
  const drop = useBoardDrop((id) => {
    void fileBoard(id, null);
  });

  return (
    <nav className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => {
          open(null);
        }}
        {...drop.handlers}
        className={`rounded-lg px-2 py-1 text-[12px] transition-colors ${
          drop.over ? 'bg-raised text-blue' : 'text-muted hover:bg-raised hover:text-ink'
        }`}
      >
        Library
      </button>
      <ChevronRight size={14} strokeWidth={1.75} className="text-muted" />
      <span className="truncate px-1 text-[15px] font-medium text-ink">{folder.name}</span>
    </nav>
  );
}

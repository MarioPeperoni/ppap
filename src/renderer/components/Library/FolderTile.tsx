import type { ReactElement } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { FolderPreview } from '@/renderer/components/Library/FolderPreview';
import { NameInput } from '@/renderer/components/NameInput/NameInput';
import { useBoardDrop } from '@/renderer/hooks/use-board-drop';
import { fileBoard, renameFolder } from '@/renderer/session/folder-session';
import { useFolderStore } from '@/renderer/stores/folder.store';
import type { BoardMeta, Folder } from '@/types';

const ACTION_CLASS =
  'flex h-7 w-7 items-center justify-center rounded-lg bg-surface/90 text-muted shadow-sm transition-colors';

interface FolderTileProps {
  folder: Folder;
  boards: readonly BoardMeta[];
  onDelete: (folder: Folder) => void;
}

export function FolderTile({ folder, boards, onDelete }: FolderTileProps): ReactElement {
  const editing = useFolderStore((state) => state.renamingId === folder.id);
  const open = useFolderStore((state) => state.open);
  const setRenaming = useFolderStore((state) => state.setRenaming);
  const drop = useBoardDrop((id) => {
    void fileBoard(id, folder.id);
  });

  return (
    <div
      className="group flex flex-col gap-2"
      onKeyDown={(event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') onDelete(folder);
        if (event.key === 'F2') setRenaming(folder.id);
      }}
    >
      <div className="relative">
        <button
          type="button"
          aria-label={`Open ${folder.name}`}
          onClick={() => {
            open(folder.id);
          }}
          {...drop.handlers}
          className={`block aspect-8/5 w-full overflow-hidden rounded-xl border bg-raised transition-colors ${
            drop.over ? 'border-blue text-blue' : 'border-line text-muted hover:border-muted'
          }`}
        >
          <FolderPreview boards={boards} />
        </button>
        <div className="absolute top-2 right-2 hidden gap-1 group-hover:flex">
          <button
            type="button"
            aria-label={`Rename ${folder.name}`}
            onClick={() => {
              setRenaming(folder.id);
            }}
            className={`${ACTION_CLASS} hover:text-ink`}
          >
            <Pencil size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${folder.name}`}
            onClick={() => {
              onDelete(folder);
            }}
            className={`${ACTION_CLASS} hover:text-red`}
          >
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {editing ? (
        <NameInput
          value={folder.name}
          className="rounded-sm bg-raised px-1.5 py-0.5 text-[12px] text-ink outline-none"
          onCommit={(name) => {
            setRenaming(null);
            void renameFolder(folder.id, name);
          }}
          onCancel={() => {
            setRenaming(null);
          }}
        />
      ) : (
        <button
          type="button"
          aria-label={`Rename ${folder.name}`}
          onClick={() => {
            setRenaming(folder.id);
          }}
          className="truncate rounded-sm px-1.5 text-left text-[12px] text-ink transition-colors hover:bg-raised"
        >
          {folder.name}
        </button>
      )}
      <span className="px-1.5 text-[11px] text-muted">
        {boards.length === 1 ? '1 board' : `${boards.length} boards`}
      </span>
    </div>
  );
}

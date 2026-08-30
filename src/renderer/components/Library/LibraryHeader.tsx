import type { ReactElement } from 'react';
import { LibraryBreadcrumb } from '@/renderer/components/Library/LibraryBreadcrumb';
import { SortMenu } from '@/renderer/components/Library/SortMenu';
import type { Folder } from '@/types';

interface LibraryHeaderProps {
  folder: Folder | null;
}

export function LibraryHeader({ folder }: LibraryHeaderProps): ReactElement {
  return (
    <header className="mb-5 flex h-8 items-center justify-between">
      {folder === null ? (
        <h1 className="px-1 text-[15px] font-medium text-ink">Library</h1>
      ) : (
        <LibraryBreadcrumb folder={folder} />
      )}
      <SortMenu />
    </header>
  );
}

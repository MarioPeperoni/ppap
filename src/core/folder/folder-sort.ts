import type { Folder } from '@/types';

export function sortFolders(folders: readonly Folder[]): Folder[] {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name));
}

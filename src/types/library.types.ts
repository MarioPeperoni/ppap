import type { AssetEntries, NewAsset } from './asset.types';
import type { BoardContent, BoardFile, BoardMeta } from './board.types';

export type SortOrder = 'modified' | 'name' | 'created';

export interface BoardArchive {
  meta: BoardMeta;
  content: BoardContent;
  thumbnail: Uint8Array | null;
  assets: AssetEntries;
}

export interface BoardRepository {
  list: () => Promise<BoardMeta[]>;
  meta: (id: string) => Promise<BoardMeta>;
  create: () => Promise<BoardMeta>;
  load: (id: string) => Promise<BoardFile>;
  save: (
    id: string,
    content: BoardContent,
    assets: readonly NewAsset[],
    thumbnail: Uint8Array | null,
  ) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  thumbnail: (id: string) => Promise<Uint8Array | null>;
  read: (id: string) => Promise<Uint8Array>;
  adopt: (archive: Uint8Array) => Promise<BoardMeta>;
}

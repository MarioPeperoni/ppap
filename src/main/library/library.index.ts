import { readdir, readFile } from 'node:fs/promises';
import { decodeMeta } from '@/main/archive/archive.codec';
import { writeAtomic } from '@/main/library/atomic-write';
import {
  boardIdFromFile,
  boardPath,
  boardsDirectory,
  ensureLibrary,
  indexPath,
} from '@/main/library/library-paths';
import { saveQueue } from '@/main/library/save-queue';
import type { BoardMeta } from '@/types';
import { parseBoardMeta } from '@/validation/board-file.validator';
import { expectArray } from '@/validation/primitive.validator';

const INDEX_KEY = 'library-index';

type Boards = Map<string, BoardMeta>;

function holdsExactly(boards: Boards, ids: readonly string[]): boolean {
  return boards.size === ids.length && ids.every((id) => boards.has(id));
}

class LibraryIndex {
  private boards: Promise<Boards> | null = null;

  async list(): Promise<BoardMeta[]> {
    return [...(await this.load()).values()];
  }

  async require(id: string): Promise<BoardMeta> {
    const meta = (await this.load()).get(id);
    if (meta === undefined) throw new Error(`Unknown board: ${id}`);

    return meta;
  }

  async upsert(meta: BoardMeta): Promise<void> {
    const boards = await this.load();
    boards.set(meta.id, meta);
    this.persist(boards);
  }

  async remove(id: string): Promise<void> {
    const boards = await this.load();
    boards.delete(id);
    this.persist(boards);
  }

  private load(): Promise<Boards> {
    this.boards ??= this.read();

    return this.boards;
  }

  private async read(): Promise<Boards> {
    await ensureLibrary();
    const ids = await this.archiveIds();
    const cached = await this.readCache();

    if (cached !== null && holdsExactly(cached, ids)) return cached;

    return this.rebuild(ids);
  }

  private async readCache(): Promise<Boards | null> {
    try {
      const parsed: unknown = JSON.parse(await readFile(indexPath(), 'utf8'));
      const boards = expectArray(parsed, 'Library index').map(parseBoardMeta);

      return new Map(boards.map((meta) => [meta.id, meta]));
    } catch {
      return null;
    }
  }

  private async archiveIds(): Promise<string[]> {
    const files = await readdir(boardsDirectory());

    return files.map(boardIdFromFile).filter((id) => id !== null);
  }

  private async rebuild(ids: readonly string[]): Promise<Boards> {
    const boards: Boards = new Map();

    for (const id of ids) {
      try {
        boards.set(id, decodeMeta(await readFile(boardPath(id))));
      } catch (error) {
        console.error(`Skipping unreadable board ${id}`, error);
      }
    }

    this.persist(boards);

    return boards;
  }

  private persist(boards: Boards): void {
    const snapshot = JSON.stringify([...boards.values()]);

    void saveQueue.push(INDEX_KEY, () => writeAtomic(indexPath(), snapshot));
  }
}

export const libraryIndex = new LibraryIndex();

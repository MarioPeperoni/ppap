import { randomUUID } from 'node:crypto';
import { readFile, rm } from 'node:fs/promises';
import { DEFAULT_CAMERA } from '@/constants/camera.constants';
import { BOARD_FORMAT, BOARD_VERSION } from '@/constants/library.constants';
import { defaultBoardName } from '@/core/board/board-name';
import { decodeArchive, decodeThumbnail, encodeArchive } from '@/main/archive/archive.codec';
import { writeAtomic } from '@/main/library/atomic-write';
import { boardPath, ensureLibrary } from '@/main/library/library-paths';
import { libraryIndex } from '@/main/library/library.index';
import { saveQueue } from '@/main/library/save-queue';
import type { BoardArchive, BoardContent, BoardFile, BoardMeta, BoardRepository } from '@/types';

class FileBoardRepository implements BoardRepository {
  private open: { id: string; thumbnail: Uint8Array | null } | null = null;

  list(): Promise<BoardMeta[]> {
    return libraryIndex.list();
  }

  meta(id: string): Promise<BoardMeta> {
    return libraryIndex.require(id);
  }

  async create(): Promise<BoardMeta> {
    const now = new Date();
    const meta: BoardMeta = {
      format: BOARD_FORMAT,
      version: BOARD_VERSION,
      id: randomUUID(),
      name: defaultBoardName(now),
      createdAt: now.toISOString(),
      modifiedAt: now.toISOString(),
      folderId: null,
    };
    const content: BoardContent = { gridVisible: true, camera: DEFAULT_CAMERA, elements: [] };

    await libraryIndex.upsert(meta);
    await this.write({ meta, content, thumbnail: null });

    return meta;
  }

  async load(id: string): Promise<BoardFile> {
    const archive = decodeArchive(await this.read(id));

    this.open = { id, thumbnail: archive.thumbnail };
    await libraryIndex.upsert(archive.meta);

    return { meta: archive.meta, content: archive.content };
  }

  async save(id: string, content: BoardContent, thumbnail: Uint8Array | null): Promise<void> {
    const meta: BoardMeta = {
      ...(await libraryIndex.require(id)),
      modifiedAt: new Date().toISOString(),
    };
    const kept = thumbnail ?? this.heldThumbnail(id);

    this.open = { id, thumbnail: kept };
    await libraryIndex.upsert(meta);
    await this.write({ meta, content, thumbnail: kept });
  }

  async rename(id: string, name: string): Promise<void> {
    const archive = decodeArchive(await this.read(id));
    const meta: BoardMeta = { ...archive.meta, name, modifiedAt: new Date().toISOString() };

    await libraryIndex.upsert(meta);
    await this.write({ ...archive, meta });
  }

  async remove(id: string): Promise<void> {
    await rm(boardPath(id), { force: true });
    await libraryIndex.remove(id);

    if (this.open?.id === id) this.open = null;
  }

  async thumbnail(id: string): Promise<Uint8Array | null> {
    try {
      return decodeThumbnail(await this.read(id));
    } catch {
      return null;
    }
  }

  async read(id: string): Promise<Uint8Array> {
    await ensureLibrary();

    return readFile(boardPath(id));
  }

  async adopt(archive: Uint8Array): Promise<BoardMeta> {
    const decoded = decodeArchive(archive);
    const meta: BoardMeta = {
      ...decoded.meta,
      id: randomUUID(),
      modifiedAt: new Date().toISOString(),
      folderId: null,
    };

    await libraryIndex.upsert(meta);
    await this.write({ ...decoded, meta });

    return meta;
  }

  private heldThumbnail(id: string): Uint8Array | null {
    return this.open?.id === id ? this.open.thumbnail : null;
  }

  private write(archive: BoardArchive): Promise<void> {
    const bytes = encodeArchive(archive);

    return saveQueue.push(archive.meta.id, async () => {
      await ensureLibrary();
      await writeAtomic(boardPath(archive.meta.id), bytes);
    });
  }
}

export const boardRepository = new FileBoardRepository();

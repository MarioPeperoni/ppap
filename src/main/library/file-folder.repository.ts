import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { writeAtomic } from '@/main/library/atomic-write';
import { ensureLibrary, foldersPath } from '@/main/library/library-paths';
import { saveQueue } from '@/main/library/save-queue';
import type { Folder, FolderRepository } from '@/types';
import { parseFolders } from '@/validation/folder.validator';

const FOLDERS_KEY = 'folders';

class FileFolderRepository implements FolderRepository {
  private folders: Promise<Folder[]> | null = null;

  async list(): Promise<Folder[]> {
    return [...(await this.load())];
  }

  async create(name: string): Promise<Folder> {
    const folder: Folder = { id: randomUUID(), name, createdAt: new Date().toISOString() };

    this.persist([...(await this.load()), folder]);

    return folder;
  }

  async rename(id: string, name: string): Promise<void> {
    const folders = await this.load();

    this.persist(folders.map((folder) => (folder.id === id ? { ...folder, name } : folder)));
  }

  async remove(id: string): Promise<void> {
    const folders = await this.load();

    this.persist(folders.filter((folder) => folder.id !== id));
  }

  private load(): Promise<Folder[]> {
    this.folders ??= this.read();

    return this.folders;
  }

  private async read(): Promise<Folder[]> {
    await ensureLibrary();

    try {
      return parseFolders(JSON.parse(await readFile(foldersPath(), 'utf8')));
    } catch {
      return [];
    }
  }

  private persist(folders: readonly Folder[]): void {
    const snapshot = JSON.stringify(folders);

    this.folders = Promise.resolve([...folders]);
    void saveQueue.push(FOLDERS_KEY, () => writeAtomic(foldersPath(), snapshot));
  }
}

export const folderRepository = new FileFolderRepository();

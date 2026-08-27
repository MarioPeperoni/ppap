export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface FolderRepository {
  list: () => Promise<Folder[]>;
  create: (name: string) => Promise<Folder>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

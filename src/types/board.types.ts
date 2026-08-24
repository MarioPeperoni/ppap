import type { CameraState } from './camera.types';
import type { Element } from './element.types';

export interface BoardMeta {
  format: 'ppap';
  version: 1;
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  folderId: string | null;
}

export interface BoardContent {
  gridVisible: boolean;
  camera: CameraState;
  elements: Element[];
}

export interface BoardFile {
  meta: BoardMeta;
  content: BoardContent;
}

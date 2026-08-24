import { create } from 'zustand';
import { DEFAULT_CAMERA } from '@/constants/camera.constants';
import { applyPatch } from '@/core/scene/scene-patch';
import { retainExisting } from '@/core/scene/scene-selection';
import type { BoardFile, CameraState, Element, Scene, ScenePatch } from '@/types';

interface BoardState {
  id: string;
  name: string;
  elements: Scene;
  camera: CameraState;
  selection: ReadonlySet<string>;
  gridVisible: boolean;
  lastPatch: ScenePatch | null;
}

interface BoardStore extends BoardState {
  open: (file: BoardFile) => void;
  close: () => void;
  applyScenePatch: (patch: ScenePatch) => ScenePatch;
  setCamera: (camera: CameraState) => void;
  setName: (name: string) => void;
  toggleGrid: () => void;
  setSelection: (ids: Iterable<string>) => void;
}

function emptyBoard(): BoardState {
  return {
    id: '',
    name: '',
    elements: new Map<string, Element>(),
    camera: DEFAULT_CAMERA,
    selection: new Set<string>(),
    gridVisible: true,
    lastPatch: null,
  };
}

export const useBoardStore = create<BoardStore>()((set, get) => ({
  ...emptyBoard(),

  open: (file) => {
    set({
      ...emptyBoard(),
      id: file.meta.id,
      name: file.meta.name,
      elements: new Map(file.content.elements.map((element) => [element.id, element])),
      camera: file.content.camera,
      gridVisible: file.content.gridVisible,
    });
  },

  close: () => {
    set(emptyBoard());
  },

  applyScenePatch: (patch) => {
    const { scene, inverse } = applyPatch(get().elements, patch);
    set({
      elements: scene,
      lastPatch: patch,
      selection: retainExisting(get().selection, scene),
    });

    return inverse;
  },

  setCamera: (camera) => {
    set({ camera });
  },

  setName: (name) => {
    set({ name });
  },

  toggleGrid: () => {
    set({ gridVisible: !get().gridVisible });
  },

  setSelection: (ids) => {
    set({ selection: new Set(ids) });
  },
}));

import { create } from 'zustand';
import { DEFAULT_CAMERA } from '@/constants/camera.constants';
import { defaultBoardName } from '@/core/board/board-name';
import { applyPatch } from '@/core/scene/scene-patch';
import { retainExisting } from '@/core/scene/scene-selection';
import type { CameraState, Element, Scene, ScenePatch } from '@/types';

interface BoardStore {
  id: string;
  name: string;
  elements: Scene;
  camera: CameraState;
  selection: ReadonlySet<string>;
  gridVisible: boolean;
  lastPatch: ScenePatch | null;
  applyScenePatch: (patch: ScenePatch) => ScenePatch;
  setCamera: (camera: CameraState) => void;
  setName: (name: string) => void;
  toggleGrid: () => void;
  setSelection: (ids: Iterable<string>) => void;
}

export const useBoardStore = create<BoardStore>()((set, get) => ({
  id: crypto.randomUUID(),
  name: defaultBoardName(new Date()),
  elements: new Map<string, Element>(),
  camera: DEFAULT_CAMERA,
  selection: new Set<string>(),
  gridVisible: true,
  lastPatch: null,

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

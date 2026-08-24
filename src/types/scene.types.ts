import type { Element } from './element.types';

export type Scene = ReadonlyMap<string, Element>;

export interface ElementPlacement {
  element: Element;
  before: string | null;
}

export interface ScenePatch {
  removed: readonly string[];
  added: readonly ElementPlacement[];
}

export interface PatchResult {
  scene: Scene;
  inverse: ScenePatch;
}

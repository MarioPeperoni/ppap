import type { Element, ElementPlacement, PatchResult, Scene, ScenePatch } from '@/types';

export const EMPTY_PATCH: ScenePatch = { removed: [], added: [] };

export function appendPatch(elements: readonly Element[]): ScenePatch {
  return { removed: [], added: elements.map((element) => ({ element, before: null })) };
}

export function removePatch(ids: readonly string[]): ScenePatch {
  return { removed: ids, added: [] };
}

export function isEmptyPatch(patch: ScenePatch): boolean {
  return patch.removed.length === 0 && patch.added.length === 0;
}

export function isAppendOnly(patch: ScenePatch): boolean {
  return patch.removed.length === 0 && patch.added.every((placement) => placement.before === null);
}

export function applyPatch(scene: Scene, patch: ScenePatch): PatchResult {
  const removed = new Set(patch.removed);
  const insertions = new Map<string, Element[]>();
  const appended: Element[] = [];

  for (const { element, before } of patch.added) {
    if (before === null) {
      appended.push(element);
      continue;
    }

    const bucket = insertions.get(before);
    if (bucket === undefined) insertions.set(before, [element]);
    else bucket.push(element);
  }

  const next = new Map<string, Element>();
  const restored: ElementPlacement[] = [];
  let pending: Element[] = [];

  for (const [id, element] of scene) {
    for (const inserted of insertions.get(id) ?? []) next.set(inserted.id, inserted);

    if (removed.has(id)) {
      pending.push(element);
      continue;
    }

    for (const held of pending) restored.push({ element: held, before: id });
    pending = [];
    next.set(id, element);
  }

  for (const element of appended) next.set(element.id, element);
  for (const held of pending) restored.push({ element: held, before: null });

  return {
    scene: next,
    inverse: { removed: patch.added.map(({ element }) => element.id), added: restored },
  };
}

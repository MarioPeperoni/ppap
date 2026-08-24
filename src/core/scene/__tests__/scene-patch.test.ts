import { describe, expect, it } from 'vitest';
import { createStroke } from '@/core/element/element.factory';
import {
  appendPatch,
  applyPatch,
  EMPTY_PATCH,
  isAppendOnly,
  isEmptyPatch,
  removePatch,
} from '@/core/scene/scene-patch';
import type { Element, Scene } from '@/types';

function stroke(x: number) {
  return createStroke([[x, 0, 0.5]], 'ink', 'm');
}

function sceneOf(elements: Element[]): Scene {
  return new Map(elements.map((element) => [element.id, element]));
}

describe('scene patch', () => {
  it('appends elements at the end of the z-order', () => {
    const [first, second, third] = [stroke(0), stroke(1), stroke(2)];
    const { scene } = applyPatch(sceneOf([first, second]), appendPatch([third]));

    expect([...scene.keys()]).toEqual([first.id, second.id, third.id]);
  });

  it('places replacements at the position of the element they replace', () => {
    const [first, second, third] = [stroke(0), stroke(1), stroke(2)];
    const [left, right] = [stroke(3), stroke(4)];
    const { scene } = applyPatch(sceneOf([first, second, third]), {
      removed: [second.id],
      added: [
        { element: left, before: second.id },
        { element: right, before: second.id },
      ],
    });

    expect([...scene.keys()]).toEqual([first.id, left.id, right.id, third.id]);
  });

  it('inverts a replacement back to the original order', () => {
    const [first, second, third] = [stroke(0), stroke(1), stroke(2)];
    const original = sceneOf([first, second, third]);
    const fragment = stroke(3);
    const { scene, inverse } = applyPatch(original, {
      removed: [second.id],
      added: [{ element: fragment, before: second.id }],
    });
    const restored = applyPatch(scene, inverse).scene;

    expect([...restored.keys()]).toEqual([...original.keys()]);
    expect(restored.get(second.id)).toBe(second);
  });

  it('inverts a removal at the tail of the scene', () => {
    const [first, second] = [stroke(0), stroke(1)];
    const original = sceneOf([first, second]);
    const { scene, inverse } = applyPatch(original, removePatch([second.id]));

    expect([...scene.keys()]).toEqual([first.id]);
    expect([...applyPatch(scene, inverse).scene.keys()]).toEqual([first.id, second.id]);
  });

  it('inverts a removal of neighbouring elements', () => {
    const elements = [stroke(0), stroke(1), stroke(2), stroke(3)];
    const [first, second, third, fourth] = elements;
    const ids = [second?.id ?? '', third?.id ?? ''];
    const { scene, inverse } = applyPatch(sceneOf(elements), removePatch(ids));
    const restored = applyPatch(scene, inverse).scene;

    expect([...restored.keys()]).toEqual([first?.id, second?.id, third?.id, fourth?.id]);
  });

  it('recognises empty and append-only patches', () => {
    expect(isEmptyPatch(EMPTY_PATCH)).toBe(true);
    expect(isAppendOnly(appendPatch([stroke(0)]))).toBe(true);
    expect(isAppendOnly(removePatch(['x']))).toBe(false);
    expect(isAppendOnly({ removed: [], added: [{ element: stroke(0), before: 'x' }] })).toBe(false);
  });
});

import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import type { Command, ScenePatch } from '@/types';

export function sceneCommand(
  label: string,
  forward: readonly ScenePatch[],
  appliedInverses: readonly ScenePatch[],
): Command {
  let backward: readonly ScenePatch[] = appliedInverses;

  return {
    label,
    apply: () => {
      const { applyScenePatch } = useBoardStore.getState();
      backward = forward.map((patch) => applyScenePatch(patch));
    },
    revert: () => {
      const { applyScenePatch } = useBoardStore.getState();
      for (let index = backward.length - 1; index >= 0; index -= 1) {
        const patch = backward[index];
        if (patch !== undefined) applyScenePatch(patch);
      }
    },
  };
}

export function commitPatch(label: string, patch: ScenePatch): void {
  const inverse = useBoardStore.getState().applyScenePatch(patch);
  useHistoryStore.getState().record(sceneCommand(label, [patch], [inverse]));
}

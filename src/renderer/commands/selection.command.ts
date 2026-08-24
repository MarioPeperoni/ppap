import { sceneCommand } from '@/renderer/commands/scene.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useHistoryStore } from '@/renderer/stores/history.store';
import type { Command, ScenePatch } from '@/types';

function withSelection(
  command: Command,
  before: readonly string[],
  after: readonly string[],
): Command {
  return {
    label: command.label,
    apply: () => {
      command.apply();
      useBoardStore.getState().setSelection(after);
    },
    revert: () => {
      command.revert();
      useBoardStore.getState().setSelection(before);
    },
  };
}

export function commitSelectionPatch(
  label: string,
  patch: ScenePatch,
  selection: readonly string[],
): void {
  const board = useBoardStore.getState();
  const before = [...board.selection];
  const inverse = board.applyScenePatch(patch);
  board.setSelection(selection);

  useHistoryStore
    .getState()
    .record(withSelection(sceneCommand(label, [patch], [inverse]), before, selection));
}

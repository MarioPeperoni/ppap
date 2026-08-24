import { DUPLICATE_OFFSET } from '@/constants/select.constants';
import { DEFAULT_SELECTION_TOOL } from '@/constants/tool.constants';
import { boundsOfElements } from '@/core/element/element-bounds';
import { cloneElement } from '@/core/element/element.factory';
import { boundsCenter } from '@/core/geometry/bounds';
import { appendPatch, removePatch } from '@/core/scene/scene-patch';
import { translateElement } from '@/core/select/select-transform';
import { readClipboard, writeClipboard } from '@/renderer/board/selection/selection-clipboard';
import { selectedElements } from '@/renderer/board/selection/selection-query';
import { isSelectionTool } from '@/renderer/board/tools/tool-registry';
import { commitSelectionPatch } from '@/renderer/commands/selection.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { Element, Point } from '@/types';

export function activateSelectionTool(): void {
  const { tool, setTool } = useToolStore.getState();
  if (isSelectionTool(tool)) return;

  setTool(DEFAULT_SELECTION_TOOL);
}

function idsOf(elements: readonly Element[]): string[] {
  return elements.map((element) => element.id);
}

export function selectAll(): void {
  activateSelectionTool();
  const { elements, setSelection } = useBoardStore.getState();
  setSelection(elements.keys());
}

export function clearSelection(): void {
  useBoardStore.getState().setSelection([]);
}

export function deleteSelection(): void {
  const ids = [...useBoardStore.getState().selection];
  if (ids.length === 0) return;

  commitSelectionPatch('delete', removePatch(ids), []);
}

export function copySelection(): void {
  const selected = selectedElements();
  if (selected.length === 0) return;

  writeClipboard(selected);
}

export function cutSelection(): void {
  copySelection();
  deleteSelection();
}

export function pasteClipboard(at: Point): void {
  const held = readClipboard();
  const bounds = boundsOfElements(held);
  if (bounds === null) return;

  const centre = boundsCenter(bounds);
  const pasted = held.map((element) =>
    translateElement(cloneElement(element), at.x - centre.x, at.y - centre.y),
  );

  activateSelectionTool();
  commitSelectionPatch('paste', appendPatch(pasted), idsOf(pasted));
}

export function duplicateSelection(): void {
  const selected = selectedElements();
  if (selected.length === 0) return;

  const copies = selected.map((element) =>
    translateElement(cloneElement(element), DUPLICATE_OFFSET, DUPLICATE_OFFSET),
  );

  activateSelectionTool();
  commitSelectionPatch('duplicate', appendPatch(copies), idsOf(copies));
}

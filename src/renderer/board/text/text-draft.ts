import { DEFAULT_TEXT_SCALE } from '@/constants/text.constants';
import { createText } from '@/core/element/element.factory';
import { appendPatch, removePatch, updatePatch } from '@/core/scene/scene-patch';
import { pickText } from '@/core/text/text-pick';
import { layoutText } from '@/renderer/board/text/text-layout';
import { commitPatch } from '@/renderer/commands/scene.command';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useTextStore } from '@/renderer/stores/text.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import type { Point, TextDraft, TextElement } from '@/types';

function write(draft: TextDraft): void {
  const held = useBoardStore.getState().elements.get(draft.id);
  const edited = held?.type === 'text' ? held : null;

  if (draft.text.trim() === '') {
    if (edited !== null) commitPatch('delete text', removePatch([edited.id]));
    return;
  }

  const layout = layoutText(draft.text, draft.size, draft.scale, draft.font);

  if (edited === null) {
    const placed = createText({
      text: draft.text,
      x: draft.x,
      y: draft.y,
      width: layout.width,
      height: layout.height,
      color: draft.color,
      size: draft.size,
      font: draft.font,
      scale: draft.scale,
    });

    commitPatch('text', appendPatch([placed]));
    return;
  }

  if (edited.text === draft.text) return;

  const rewritten = { ...edited, text: draft.text, width: layout.width, height: layout.height };
  commitPatch('edit text', updatePatch([rewritten]));
}

/** A fresh box hangs off the click, its first line centred on the point. */
function placeText(at: Point): void {
  const { color, textSize, textFont } = useToolStore.getState();
  const layout = layoutText('', textSize, DEFAULT_TEXT_SCALE, textFont);

  useTextStore.getState().begin({
    id: crypto.randomUUID(),
    x: at.x,
    y: at.y - layout.height / 2,
    text: '',
    color,
    size: textSize,
    font: textFont,
    scale: DEFAULT_TEXT_SCALE,
  });
}

function editText(element: TextElement): void {
  useTextStore.getState().begin({
    id: element.id,
    x: element.x,
    y: element.y,
    text: element.text,
    color: element.color,
    size: element.size,
    font: element.font,
    scale: element.scale,
  });
}

export function typeTextAt(point: Point): void {
  const picked = pickText(useBoardStore.getState().elements.values(), point);

  if (picked === null) placeText(point);
  else editText(picked);
}

/** Commits the named draft only, so a late blur cannot close the one that replaced it. */
export function commitText(id: string): void {
  const { draft, close } = useTextStore.getState();
  if (draft === null || draft.id !== id) return;

  close();
  write(draft);
}

export function commitOpenText(): void {
  const { draft } = useTextStore.getState();
  if (draft === null) return;

  commitText(draft.id);
}

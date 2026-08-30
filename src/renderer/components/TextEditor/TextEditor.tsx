import { useEffect, useRef, type ReactElement } from 'react';
import { FONT_FAMILIES, TEXT_CARET_PAD } from '@/constants/text.constants';
import { strokeColor } from '@/core/color/stroke-color';
import { fontSize, lineHeight } from '@/core/text/text-font';
import { commitText } from '@/renderer/board/text/text-draft';
import { layoutText } from '@/renderer/board/text/text-layout';
import { useCanvasColors } from '@/renderer/hooks/use-canvas-colors';
import { useBoardStore } from '@/renderer/stores/board.store';
import { useTextStore } from '@/renderer/stores/text.store';

export function TextEditor(): ReactElement | null {
  const draft = useTextStore((state) => state.draft);
  const type = useTextStore((state) => state.type);
  const camera = useBoardStore((state) => state.camera);
  const colors = useCanvasColors();
  const field = useRef<HTMLTextAreaElement>(null);
  const editing = draft?.id ?? null;

  useEffect(() => {
    const area = field.current;
    if (area === null) return;

    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
  }, [editing]);

  if (draft === null) return null;

  const { zoom } = camera;
  const layout = layoutText(draft.text, draft.size, draft.scale, draft.font);
  const ink = strokeColor(draft.color, colors);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <textarea
        ref={field}
        value={draft.text}
        wrap="off"
        spellCheck={false}
        aria-label="Text"
        onChange={(event) => {
          type(event.target.value);
        }}
        onBlur={() => {
          commitText(draft.id);
        }}
        onKeyDown={(event) => {
          const submitted = event.key === 'Enter' && (event.ctrlKey || event.metaKey);
          if (event.key !== 'Escape' && !submitted) return;

          event.preventDefault();
          commitText(draft.id);
        }}
        style={{
          left: (draft.x - camera.x) * zoom,
          top: (draft.y - camera.y) * zoom,
          width: layout.width * zoom + TEXT_CARET_PAD,
          height: layout.height * zoom,
          fontFamily: FONT_FAMILIES[draft.font],
          fontSize: fontSize(draft.size, draft.scale) * zoom,
          lineHeight: `${lineHeight(draft.size, draft.scale) * zoom}px`,
          color: ink,
          caretColor: ink,
        }}
        className="pointer-events-auto absolute m-0 resize-none overflow-hidden border-0 bg-transparent p-0 whitespace-pre outline-none"
      />
    </div>
  );
}

import { useEffect, useState, type ReactElement } from 'react';
import { ACTION_GROUPS } from '@/constants/keymap.constants';
import { isModifierKey, strokeFromEvent } from '@/core/keymap/key-stroke';
import { KeymapRow } from '@/renderer/components/Settings/Keymap/KeymapRow';
import { useKeymapStore } from '@/renderer/stores/keymap.store';
import type { ActionId, BindVerdict } from '@/types';

interface Note {
  action: ActionId;
  verdict: BindVerdict;
}

export function KeymapPanel(): ReactElement {
  const keymap = useKeymapStore((state) => state.keymap);
  const bind = useKeymapStore((state) => state.bind);
  const clear = useKeymapStore((state) => state.clear);
  const reset = useKeymapStore((state) => state.reset);
  const resetAll = useKeymapStore((state) => state.resetAll);
  const [armed, setArmed] = useState<ActionId | null>(null);
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (armed === null) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      if (isModifierKey(event.key)) return;

      setArmed(null);
      if (event.key === 'Escape') return;

      setNote({ action: armed, verdict: bind(armed, strokeFromEvent(event)) });
    };

    window.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [armed, bind]);

  return (
    <>
      <div className="-mx-5 mt-5 flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-5">
        {ACTION_GROUPS.map((group) => (
          <section key={group.label} className="flex flex-col gap-1">
            <h3 className="text-[11px] tracking-wide text-muted uppercase">{group.label}</h3>
            {group.actions.map((action) => (
              <KeymapRow
                key={action}
                action={action}
                stroke={keymap[action]}
                armed={armed === action}
                note={note?.action === action ? note.verdict : null}
                onArm={() => {
                  setNote(null);
                  setArmed(action);
                }}
                onClear={() => {
                  clear(action);
                }}
                onReset={() => {
                  reset(action);
                }}
              />
            ))}
          </section>
        ))}
      </div>

      <footer className="mt-5 flex justify-end border-t border-line pt-4">
        <button
          type="button"
          onClick={() => {
            setNote(null);
            resetAll();
          }}
          className="rounded-lg bg-raised px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:bg-line hover:text-ink"
        >
          Reset all
        </button>
      </footer>
    </>
  );
}

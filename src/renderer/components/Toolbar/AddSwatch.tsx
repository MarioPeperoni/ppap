import type { ReactElement } from 'react';
import { Plus } from 'lucide-react';
import type { HexColor } from '@/types';

interface AddSwatchProps {
  draft: HexColor | null;
  onClick: () => void;
}

export function AddSwatch({ draft, onClick }: AddSwatchProps): ReactElement {
  return (
    <button
      type="button"
      aria-label="add a colour"
      onClick={onClick}
      style={draft === null ? undefined : { backgroundColor: draft }}
      className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
        draft === null
          ? 'text-muted ring-1 ring-line hover:text-ink hover:ring-muted'
          : 'ring-2 ring-ink/60'
      }`}
    >
      {draft === null ? <Plus size={13} strokeWidth={2} /> : null}
    </button>
  );
}

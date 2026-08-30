import type { ReactElement, ReactNode } from 'react';

const STEP_MS = 26;
const LAST_STEP = 12;

interface TileEnterProps {
  index: number;
  children: ReactNode;
}

export function TileEnter({ index, children }: TileEnterProps): ReactElement {
  return (
    <div
      className="animate-tile-in"
      style={{ animationDelay: `${Math.min(index, LAST_STEP) * STEP_MS}ms` }}
    >
      {children}
    </div>
  );
}

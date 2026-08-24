import type { ReactElement } from 'react';
import { EraserOptions } from '@/renderer/components/Toolbar/EraserOptions';
import { PenOptions } from '@/renderer/components/Toolbar/PenOptions';
import type { ToolId } from '@/types';

const OPTIONS: Record<ToolId, (() => ReactElement) | null> = {
  pen: PenOptions,
  pencil: PenOptions,
  eraser: EraserOptions,
  marquee: null,
  lasso: null,
  hand: null,
};

interface ToolOptionsProps {
  tool: ToolId;
}

export function hasOptions(tool: ToolId): boolean {
  return OPTIONS[tool] !== null;
}

export function ToolOptions({ tool }: ToolOptionsProps): ReactElement | null {
  const Options = OPTIONS[tool];
  if (Options === null) return null;

  return <Options />;
}

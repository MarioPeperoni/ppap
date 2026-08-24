import type { ReactElement } from 'react';
import { EraserOptions } from '@/renderer/components/Toolbar/EraserOptions';
import { PenOptions } from '@/renderer/components/Toolbar/PenOptions';
import type { ToolId } from '@/types';

interface ToolOptionsProps {
  tool: ToolId;
}

export function hasOptions(tool: ToolId): boolean {
  return tool !== 'hand';
}

export function ToolOptions({ tool }: ToolOptionsProps): ReactElement | null {
  switch (tool) {
    case 'pen':
      return <PenOptions />;
    case 'eraser':
      return <EraserOptions />;
    case 'hand':
      return null;
  }
}

import type { ReactElement } from 'react';
import { TOOL_IDS } from '@/renderer/board/tools/tool-registry';
import { ToolButton } from '@/renderer/components/Toolbar/ToolButton';

export function Toolbar(): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-line bg-surface/95 p-1.5 shadow-lg backdrop-blur">
        {TOOL_IDS.map((id) => (
          <ToolButton key={id} id={id} />
        ))}
      </div>
    </div>
  );
}

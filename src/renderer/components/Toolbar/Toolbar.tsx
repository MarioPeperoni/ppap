import { Fragment, type ReactElement } from 'react';
import { TOOL_GROUPS } from '@/constants/tool.constants';
import { ToolButton } from '@/renderer/components/Toolbar/ToolButton';

export function Toolbar(): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div className="pointer-events-auto flex animate-view-in items-center gap-1 rounded-2xl border border-line bg-surface/95 p-1.5 shadow-lg backdrop-blur-sm">
        {TOOL_GROUPS.map((group, index) => (
          <Fragment key={group.join('-')}>
            {index === 0 ? null : <span className="mx-1 h-5 w-px bg-line" />}
            {group.map((id) => (
              <ToolButton key={id} id={id} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

import type { ReactElement } from 'react';
import { TRAFFIC_LIGHT_GUTTER } from '@/constants/window.constants';
import { BoardActions } from '@/renderer/components/TitleBar/BoardActions';
import { BoardTitle } from '@/renderer/components/TitleBar/BoardTitle';
import { LibraryActions } from '@/renderer/components/TitleBar/LibraryActions';
import { WindowControls } from '@/renderer/components/TitleBar/WindowControls';
import { useUiStore } from '@/renderer/stores/ui.store';

export function TitleBar(): ReactElement {
  const route = useUiStore((state) => state.route);
  const onMac = window.ppap.platform === 'darwin';
  const onBoard = route === 'board';

  return (
    <header className="app-drag flex h-9 shrink-0 items-center justify-between border-b border-line bg-surface">
      <div
        key={route}
        className="flex min-w-0 animate-view-in items-center gap-1"
        style={{ paddingLeft: onMac ? TRAFFIC_LIGHT_GUTTER : 12 }}
      >
        {onBoard ? <BoardTitle /> : <span className="px-2 text-[12px] text-ink/80">ppap</span>}
      </div>

      <div className="flex items-center gap-1 pr-1">
        <div key={route} className="flex animate-view-in items-center gap-1">
          {onBoard ? <BoardActions /> : <LibraryActions />}
        </div>
        {onMac ? null : <WindowControls />}
      </div>
    </header>
  );
}

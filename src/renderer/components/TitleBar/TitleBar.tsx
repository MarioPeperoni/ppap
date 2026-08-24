import type { ReactElement } from 'react';
import { TRAFFIC_LIGHT_GUTTER } from '@/constants/window.constants';
import { BoardTitle } from '@/renderer/components/TitleBar/BoardTitle';
import { WindowControls } from '@/renderer/components/TitleBar/WindowControls';

export function TitleBar(): ReactElement {
  const onMac = window.ppap.platform === 'darwin';

  return (
    <header className="app-drag flex h-9 shrink-0 items-center justify-between border-b border-line bg-surface">
      <div className="flex items-center" style={{ paddingLeft: onMac ? TRAFFIC_LIGHT_GUTTER : 12 }}>
        <BoardTitle />
      </div>
      {onMac ? null : <WindowControls />}
    </header>
  );
}

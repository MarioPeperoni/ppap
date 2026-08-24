import type { ReactElement } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Board } from '@/renderer/board/Board';
import { TitleBar } from '@/renderer/components/TitleBar/TitleBar';
import { useThemeBridge } from '@/renderer/hooks/use-theme-bridge';

export function App(): ReactElement {
  useThemeBridge();

  return (
    <Tooltip.Provider delayDuration={400} skipDelayDuration={200}>
      <div className="flex h-full flex-col bg-canvas text-ink">
        <TitleBar />
        <Board />
      </div>
    </Tooltip.Provider>
  );
}

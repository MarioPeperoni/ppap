import type { ReactElement } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Board } from '@/renderer/board/Board';
import { LibraryScreen } from '@/renderer/components/Library/LibraryScreen';
import { TitleBar } from '@/renderer/components/TitleBar/TitleBar';
import { WhatsNewDialog } from '@/renderer/components/WhatsNew/WhatsNewDialog';
import { useAppShortcuts } from '@/renderer/hooks/use-app-shortcuts';
import { useOpenBoardBridge } from '@/renderer/hooks/use-open-board-bridge';
import { useSettingsBridge } from '@/renderer/hooks/use-settings-bridge';
import { useThemeBridge } from '@/renderer/hooks/use-theme-bridge';
import { useUpdateNotice } from '@/renderer/hooks/use-update-notice';
import { useUiStore } from '@/renderer/stores/ui.store';

export function App(): ReactElement {
  useThemeBridge();
  useSettingsBridge();
  useAppShortcuts();
  useOpenBoardBridge();
  useUpdateNotice();
  const onBoard = useUiStore((state) => state.route === 'board');

  return (
    <Tooltip.Provider delayDuration={400} skipDelayDuration={200}>
      <div className="flex h-full flex-col bg-canvas text-ink">
        <TitleBar />
        {onBoard ? <Board /> : <LibraryScreen />}
        <WhatsNewDialog />
      </div>
    </Tooltip.Provider>
  );
}

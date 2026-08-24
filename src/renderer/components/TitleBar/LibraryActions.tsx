import { useState, type ReactElement } from 'react';
import { Download, Settings } from 'lucide-react';
import { SettingsDialog } from '@/renderer/components/Settings/SettingsDialog';
import { importBoard } from '@/renderer/session/board-session';

const BUTTON_CLASS =
  'flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-ink';

export function LibraryActions(): ReactElement {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app-no-drag flex items-center gap-1">
      <button
        type="button"
        aria-label="Import board"
        onClick={() => {
          void importBoard();
        }}
        className={BUTTON_CLASS}
      >
        <Download size={16} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Settings"
        onClick={() => {
          setSettingsOpen(true);
        }}
        className={BUTTON_CLASS}
      >
        <Settings size={16} strokeWidth={1.75} />
      </button>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

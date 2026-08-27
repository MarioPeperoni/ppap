import { useState, type ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft } from 'lucide-react';
import { WHEEL_ACTIONS } from '@/constants/camera.constants';
import { THEMES } from '@/constants/theme.constants';
import { BrandMark } from '@/renderer/components/Brand/BrandMark';
import { Choices } from '@/renderer/components/Settings/Choices';
import { KeymapPanel } from '@/renderer/components/Settings/Keymap/KeymapPanel';
import { useAppVersion } from '@/renderer/hooks/use-app-version';
import { useReleaseNotes } from '@/renderer/hooks/use-release-notes';
import { useInputStore } from '@/renderer/stores/input.store';
import { useThemeStore } from '@/renderer/stores/theme.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { Theme, WheelAction } from '@/types';

const THEME_LABELS: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };

const WHEEL_LABELS: Record<WheelAction, string> = { zoom: 'Zoom', pan: 'Pan' };

const LINK_CLASS =
  'rounded-lg bg-raised px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:bg-line hover:text-ink';

type SettingsView = 'main' | 'keymap';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps): ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const wheelAction = useInputStore((state) => state.wheelAction);
  const setWheelAction = useInputStore((state) => state.setWheelAction);
  const version = useAppVersion();
  const release = useReleaseNotes();
  const setWhatsNew = useUiStore((state) => state.setWhatsNew);
  const [view, setView] = useState<SettingsView>('main');

  const onKeymap = view === 'keymap';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setView('main');
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface p-5 shadow-xl ${
            onKeymap ? 'w-108' : 'w-96'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {onKeymap ? (
              <button
                type="button"
                aria-label="Back to settings"
                onClick={() => {
                  setView('main');
                }}
                className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink"
              >
                <ChevronLeft size={15} strokeWidth={2} />
              </button>
            ) : null}
            <Dialog.Title className="text-[13px] font-medium text-ink">
              {onKeymap ? 'Shortcuts' : 'Settings'}
            </Dialog.Title>
          </div>
          <Dialog.Description className="sr-only">
            Theme, scroll wheel, shortcuts and version
          </Dialog.Description>

          {onKeymap ? (
            <KeymapPanel />
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-4">
                <Choices
                  label="Theme"
                  values={THEMES}
                  labels={THEME_LABELS}
                  active={theme}
                  onSelect={setTheme}
                />
                <Choices
                  label="Scroll wheel"
                  values={WHEEL_ACTIONS}
                  labels={WHEEL_LABELS}
                  active={wheelAction}
                  onSelect={setWheelAction}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted">Shortcuts</span>
                  <button
                    type="button"
                    onClick={() => {
                      setView('keymap');
                    }}
                    className={LINK_CLASS}
                  >
                    Customise
                  </button>
                </div>
                {release === null ? null : (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">What&apos;s new</span>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        setWhatsNew(true);
                      }}
                      className={LINK_CLASS}
                    >
                      Show
                    </button>
                  </div>
                )}
              </div>

              <footer className="mt-6 flex flex-col items-center gap-2 border-t border-line pt-5">
                <BrandMark size={36} />
                <span className="text-[11px] text-muted">
                  ppap <span className="font-mono">{version}</span>
                </span>
              </footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

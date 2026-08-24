import type { ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { SORT_ORDERS } from '@/constants/settings.constants';
import { THEMES } from '@/constants/theme.constants';
import { BrandMark } from '@/renderer/components/Brand/BrandMark';
import { useAppVersion } from '@/renderer/hooks/use-app-version';
import { useReleaseNotes } from '@/renderer/hooks/use-release-notes';
import { useLibraryStore } from '@/renderer/stores/library.store';
import { useThemeStore } from '@/renderer/stores/theme.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { SortOrder, Theme } from '@/types';

const THEME_LABELS: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };

const SORT_LABELS: Record<SortOrder, string> = {
  modified: 'Modified',
  name: 'Name',
  created: 'Created',
};

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChoicesProps<T extends string> {
  label: string;
  values: readonly T[];
  labels: Record<T, string>;
  active: T;
  onSelect: (value: T) => void;
}

function Choices<T extends string>({
  label,
  values,
  labels,
  active,
  onSelect,
}: ChoicesProps<T>): ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted">{label}</span>
      <div className="flex gap-1 rounded-lg bg-raised p-0.5">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              onSelect(value);
            }}
            className={`rounded-md px-2.5 py-1 text-[12px] transition-colors ${
              value === active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {labels[value]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps): ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const setSortOrder = useLibraryStore((state) => state.setSortOrder);
  const version = useAppVersion();
  const release = useReleaseNotes();
  const setWhatsNew = useUiStore((state) => state.setWhatsNew);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface p-5 shadow-xl">
          <Dialog.Title className="text-[13px] font-medium text-ink">Settings</Dialog.Title>
          <Dialog.Description className="sr-only">
            Theme, board order and version
          </Dialog.Description>

          <div className="mt-5 flex flex-col gap-4">
            <Choices
              label="Theme"
              values={THEMES}
              labels={THEME_LABELS}
              active={theme}
              onSelect={setTheme}
            />
            <Choices
              label="Sort boards by"
              values={SORT_ORDERS}
              labels={SORT_LABELS}
              active={sortOrder}
              onSelect={setSortOrder}
            />
            {release === null ? null : (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted">What&apos;s new</span>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    setWhatsNew(true);
                  }}
                  className="rounded-lg bg-raised px-2.5 py-1.5 text-[12px] text-muted hover:text-ink"
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

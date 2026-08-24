import type { ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Minus, Plus, RefreshCw, Wrench, type LucideIcon } from 'lucide-react';
import { useReleaseNotes } from '@/renderer/hooks/use-release-notes';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { ReleaseSection } from '@/types';

const SECTION_ICONS: Record<string, LucideIcon> = {
  Added: Plus,
  Improved: RefreshCw,
  Changed: RefreshCw,
  Fixed: Wrench,
  Removed: Minus,
};

interface SectionProps {
  section: ReleaseSection;
}

function Section({ section }: SectionProps): ReactElement {
  const Icon = SECTION_ICONS[section.title] ?? Check;

  return (
    <div className="flex flex-col gap-2">
      {section.title === '' ? null : (
        <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
          {section.title}
        </h3>
      )}
      <ul className="flex flex-col gap-2">
        {section.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[12px] text-ink/85">
            <Icon size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-muted" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhatsNewDialog(): ReactElement | null {
  const release = useReleaseNotes();
  const open = useUiStore((state) => state.whatsNewOpen);
  const setWhatsNew = useUiStore((state) => state.setWhatsNew);

  if (release === null) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setWhatsNew}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 flex max-h-[70vh] w-96 -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-line bg-surface p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 text-[13px] font-medium text-ink">
              What&apos;s new
              <span className="rounded-md bg-blue/15 px-1.5 pt-1 pb-[3px] font-mono text-[11px] leading-none text-blue">
                {release.version}
              </span>
            </Dialog.Title>
            <span className="text-[11px] text-muted">{release.date}</span>
          </div>
          <Dialog.Description className="sr-only">
            Changes in version {release.version}
          </Dialog.Description>

          <div className="mt-5 flex flex-col gap-4 overflow-y-auto">
            {release.sections.map((section) => (
              <Section key={section.title} section={section} />
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Dialog.Close className="rounded-lg bg-raised px-3 py-1.5 text-[12px] text-ink hover:bg-line">
              Got it
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

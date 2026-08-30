import type { ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Section } from '@/renderer/components/WhatsNew/Section';
import { useReleaseNotes } from '@/renderer/hooks/use-release-notes';
import { DIALOG_PANEL, DIALOG_VEIL } from '@/renderer/motion/dialog-motion';
import { useUiStore } from '@/renderer/stores/ui.store';

export function WhatsNewDialog(): ReactElement | null {
  const release = useReleaseNotes();
  const open = useUiStore((state) => state.whatsNewOpen);
  const setWhatsNew = useUiStore((state) => state.setWhatsNew);

  if (release === null) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setWhatsNew}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 bg-black/40 ${DIALOG_VEIL}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 flex max-h-[70vh] w-96 -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-line bg-surface p-5 shadow-xl ${DIALOG_PANEL}`}
        >
          <div className="flex flex-col gap-1.5">
            <Dialog.Title className="flex items-center gap-2 text-[13px] font-medium text-ink">
              What&apos;s new
              <span className="rounded-md bg-blue/15 px-1.5 pt-1 pb-0.75 font-mono text-[11px] leading-none text-blue">
                {release.version}
              </span>
            </Dialog.Title>
            {release.subtitle === undefined ? null : (
              <p className="text-[12px] text-muted">{release.subtitle}</p>
            )}
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
            <Dialog.Close className="rounded-lg bg-raised px-3 py-1.5 text-[12px] text-ink transition-colors hover:bg-line">
              Got it
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import type { ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowUpDown, Check } from 'lucide-react';
import { SORT_ORDERS } from '@/constants/settings.constants';
import { POPOVER_SURFACE } from '@/renderer/motion/popover-motion';
import { useLibraryStore } from '@/renderer/stores/library.store';
import type { SortOrder } from '@/types';

const SORT_LABELS: Record<SortOrder, string> = {
  modified: 'Last modified',
  name: 'Name',
  created: 'Date created',
};

const ITEM_CLASS =
  'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-colors hover:bg-raised';

export function SortMenu(): ReactElement {
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const setSortOrder = useLibraryStore((state) => state.setSortOrder);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Sort boards"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <ArrowUpDown size={14} strokeWidth={1.75} />
          {SORT_LABELS[sortOrder]}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={6}
          className={`w-44 rounded-xl border border-line bg-surface p-1 shadow-lg ${POPOVER_SURFACE}`}
        >
          {SORT_ORDERS.map((order) => (
            <Popover.Close asChild key={order}>
              <button
                type="button"
                onClick={() => {
                  setSortOrder(order);
                }}
                className={`${ITEM_CLASS} ${order === sortOrder ? 'text-ink' : 'text-ink/80'}`}
              >
                {SORT_LABELS[order]}
                {order === sortOrder ? <Check size={13} strokeWidth={2} /> : null}
              </button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

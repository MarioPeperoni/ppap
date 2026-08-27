import type { ReactElement } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Eraser, Hand, Lasso, Pencil, PenLine, SquareDashed, type LucideIcon } from 'lucide-react';
import { INK_TOOLS } from '@/constants/tool.constants';
import { boundStrokes } from '@/core/keymap/key-binding';
import { formatStroke } from '@/core/keymap/key-stroke';
import { getTool } from '@/renderer/board/tools/tool-registry';
import { ToolColorBar } from '@/renderer/components/Toolbar/ToolColorBar';
import { hasOptions, ToolOptions } from '@/renderer/components/Toolbar/ToolOptions';
import { useKeymapStore } from '@/renderer/stores/keymap.store';
import { useToolStore } from '@/renderer/stores/tool.store';
import { useUiStore } from '@/renderer/stores/ui.store';
import type { ToolId } from '@/types';

const ICONS: Record<ToolId, LucideIcon> = {
  pen: PenLine,
  pencil: Pencil,
  eraser: Eraser,
  marquee: SquareDashed,
  lasso: Lasso,
  hand: Hand,
};

interface ToolButtonProps {
  id: ToolId;
}

export function ToolButton({ id }: ToolButtonProps): ReactElement {
  const activeTool = useToolStore((state) => state.tool);
  const setTool = useToolStore((state) => state.setTool);
  const openPopover = useUiStore((state) => state.openPopover);
  const setPopover = useUiStore((state) => state.setPopover);
  const togglePopover = useUiStore((state) => state.togglePopover);
  const binding = useKeymapStore((state) => state.keymap[`tool.${id}`]);

  const stroke = boundStrokes(binding)[0];
  const tool = getTool(id);
  const Icon = ICONS[id];
  const active = activeTool === id;
  const inked = active && INK_TOOLS.includes(id);

  return (
    <Popover.Root
      open={openPopover === id}
      onOpenChange={(next) => {
        if (!next) setPopover(null);
      }}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label={tool.label}
              onClick={() => {
                if (active && hasOptions(id)) {
                  togglePopover(id);
                  return;
                }

                setTool(id);
                setPopover(null);
              }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                active ? 'bg-raised text-ink' : 'text-muted hover:bg-raised/60 hover:text-ink'
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className={inked ? '-translate-y-px' : ''} />
              {inked ? <ToolColorBar /> : null}
            </button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={10}
            className="rounded-md bg-ink px-2 py-1 text-[11px] text-canvas"
          >
            {tool.label}
            {stroke === undefined ? null : (
              <span className="ml-1.5 opacity-60">
                {formatStroke(stroke, window.ppap.platform)}
              </span>
            )}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={12}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          className="rounded-xl border border-line bg-surface p-3 shadow-lg"
        >
          <ToolOptions tool={id} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

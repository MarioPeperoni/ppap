import type { ReactElement } from 'react';
import { Check, Minus, Plus, RefreshCw, Wrench, type LucideIcon } from 'lucide-react';
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

export function Section({ section }: SectionProps): ReactElement {
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

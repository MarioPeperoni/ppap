import type { ReactElement, ReactNode } from 'react';

interface ZoomStepProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function ZoomStep({ label, disabled, onClick, children }: ZoomStepProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

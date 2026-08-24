import { useEffect } from 'react';

export function useRenameShortcut(onRename: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'F2') return;

      event.preventDefault();
      onRename();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onRename]);
}

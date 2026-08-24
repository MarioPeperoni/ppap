import { useEffect } from 'react';
import { hasUnseenRelease } from '@/renderer/persistence/whats-new';
import { useUiStore } from '@/renderer/stores/ui.store';

export function useUpdateNotice(): void {
  const setWhatsNew = useUiStore((state) => state.setWhatsNew);

  useEffect(() => {
    let dropped = false;

    void hasUnseenRelease().then((unseen) => {
      if (unseen && !dropped) setWhatsNew(true);
    });

    return () => {
      dropped = true;
    };
  }, [setWhatsNew]);
}

import { useEffect } from 'react';
import { hydrateSettings, watchSettings } from '@/renderer/persistence/settings-bridge';
import type { Unsubscribe } from '@/types';

export function useSettingsBridge(): void {
  useEffect(() => {
    let unwatch: Unsubscribe | null = null;
    let cancelled = false;

    void hydrateSettings().then(() => {
      if (!cancelled) unwatch = watchSettings();
    });

    return () => {
      cancelled = true;
      unwatch?.();
    };
  }, []);
}

import { useEffect } from 'react';
import { useThemeStore } from '@/renderer/stores/theme.store';

export function useThemeBridge(): void {
  useEffect(() => {
    const { adopt } = useThemeStore.getState();
    void window.ppap.theme.get().then(adopt);

    return window.ppap.theme.onChange(adopt);
  }, []);
}

import { ipcRenderer } from 'electron';
import type { Unsubscribe } from '@/types';

export function subscribe<T>(
  channel: string,
  parse: (value: unknown) => T,
  callback: (value: T) => void,
): Unsubscribe {
  const listener = (_event: unknown, value: unknown): void => {
    callback(parse(value));
  };

  ipcRenderer.on(channel, listener);

  return () => {
    ipcRenderer.off(channel, listener);
  };
}

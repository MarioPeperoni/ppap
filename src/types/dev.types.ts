export interface DevTools {
  seed: (count: number) => void;
}

declare global {
  interface Window {
    __ppapDev?: DevTools;
  }
}

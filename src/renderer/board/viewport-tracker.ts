import type { ViewState } from '@/types';

export class ViewportTracker {
  private readonly observer: ResizeObserver;

  constructor(
    private readonly host: HTMLElement,
    private readonly view: ViewState,
    private readonly onResize: () => void,
  ) {
    this.observer = new ResizeObserver(this.measure);
    this.observer.observe(host);
    window.addEventListener('resize', this.measure);
  }

  destroy(): void {
    this.observer.disconnect();
    window.removeEventListener('resize', this.measure);
  }

  readonly measure = (): void => {
    const rect = this.host.getBoundingClientRect();
    this.view.width = rect.width;
    this.view.height = rect.height;
    this.view.dpr = window.devicePixelRatio;

    this.onResize();
  };
}

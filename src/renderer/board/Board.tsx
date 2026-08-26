import { useRef, type ReactElement } from 'react';
import { ColorFlash } from '@/renderer/components/ColorFlash/ColorFlash';
import { Toolbar } from '@/renderer/components/Toolbar/Toolbar';
import { ZoomIndicator } from '@/renderer/components/ZoomIndicator/ZoomIndicator';
import { useBoardHost } from '@/renderer/hooks/use-board-host';

const LAYER_CLASS = 'pointer-events-none absolute inset-0 h-full w-full';

export function Board(): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const host = useBoardHost(hostRef, gridRef, sceneRef, overlayRef);

  return (
    <main className="relative min-h-0 flex-1 bg-canvas">
      <div ref={hostRef} className="absolute inset-0 touch-none">
        <canvas ref={gridRef} className={LAYER_CLASS} />
        <canvas ref={sceneRef} className={LAYER_CLASS} />
        <canvas ref={overlayRef} className={LAYER_CLASS} />
      </div>
      <Toolbar />
      <ColorFlash />
      <ZoomIndicator
        onReset={() => {
          host?.camera.resetZoom();
        }}
        onStep={(direction) => {
          host?.camera.zoomStep(direction);
        }}
      />
    </main>
  );
}

import { useEffect, useState, type RefObject } from 'react';
import { BoardHost } from '@/renderer/board/board-host';

export function useBoardHost(
  host: RefObject<HTMLDivElement | null>,
  grid: RefObject<HTMLCanvasElement | null>,
  scene: RefObject<HTMLCanvasElement | null>,
  overlay: RefObject<HTMLCanvasElement | null>,
): BoardHost | null {
  const [boardHost, setBoardHost] = useState<BoardHost | null>(null);

  useEffect(() => {
    const elements = {
      host: host.current,
      grid: grid.current,
      scene: scene.current,
      overlay: overlay.current,
    };

    if (
      elements.host === null ||
      elements.grid === null ||
      elements.scene === null ||
      elements.overlay === null
    ) {
      return;
    }

    const created = new BoardHost({
      host: elements.host,
      grid: elements.grid,
      scene: elements.scene,
      overlay: elements.overlay,
    });
    setBoardHost(created);

    return () => {
      created.destroy();
      setBoardHost(null);
    };
  }, [host, grid, scene, overlay]);

  return boardHost;
}

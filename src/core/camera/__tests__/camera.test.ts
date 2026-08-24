import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, MIN_ZOOM } from '@/constants/camera.constants';
import { panByScreen, toBoard, toScreen } from '@/core/camera/camera-transform';
import { visibleBounds } from '@/core/camera/camera-viewport';
import { clampZoom, zoomBy, zoomToFit } from '@/core/camera/camera-zoom';

const camera = { x: -120, y: 340, zoom: 1.75 };

describe('camera transform', () => {
  it('round-trips screen and board coordinates', () => {
    const board = { x: 12.5, y: -78.25 };
    const back = toBoard(camera, toScreen(camera, board));

    expect(back.x).toBeCloseTo(board.x, 10);
    expect(back.y).toBeCloseTo(board.y, 10);
  });

  it('pans by a screen distance scaled by zoom', () => {
    const panned = panByScreen(camera, 100, -50);

    expect(panned.x).toBeCloseTo(camera.x - 100 / camera.zoom, 10);
    expect(panned.y).toBeCloseTo(camera.y + 50 / camera.zoom, 10);
  });
});

describe('camera zoom', () => {
  it('keeps the anchor fixed while zooming at a point', () => {
    const anchor = { x: 400, y: 250 };
    const before = toBoard(camera, anchor);
    const after = toBoard(zoomBy(camera, 1.1, anchor), anchor);

    expect(after.x).toBeCloseTo(before.x, 10);
    expect(after.y).toBeCloseTo(before.y, 10);
  });

  it('clamps zoom to its range', () => {
    expect(clampZoom(0.001)).toBe(MIN_ZOOM);
    expect(clampZoom(1000)).toBe(MAX_ZOOM);
    expect(zoomBy({ x: 0, y: 0, zoom: MAX_ZOOM }, 4, { x: 0, y: 0 }).zoom).toBe(MAX_ZOOM);
  });

  it('fits bounds centred inside the viewport', () => {
    const bounds = { minX: 0, minY: 0, maxX: 1000, maxY: 500 };
    const viewport = { width: 800, height: 600 };
    const fitted = zoomToFit(bounds, viewport);
    const topLeft = toScreen(fitted, { x: bounds.minX, y: bounds.minY });
    const bottomRight = toScreen(fitted, { x: bounds.maxX, y: bounds.maxY });

    expect(fitted.zoom).toBeLessThanOrEqual(1);
    expect(topLeft.x).toBeGreaterThanOrEqual(0);
    expect(topLeft.y).toBeGreaterThanOrEqual(0);
    expect(bottomRight.x).toBeLessThanOrEqual(viewport.width);
    expect(bottomRight.y).toBeLessThanOrEqual(viewport.height);
    expect(topLeft.x).toBeCloseTo(viewport.width - bottomRight.x, 10);
  });

  it('caps zoom-to-fit at 100 % for a small drawing', () => {
    const fitted = zoomToFit({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, { width: 800, height: 600 });

    expect(fitted.zoom).toBe(1);
  });
});

describe('camera viewport', () => {
  it('reports the visible board rect', () => {
    const bounds = visibleBounds(camera, { width: 800, height: 600 });

    expect(bounds.minX).toBe(camera.x);
    expect(bounds.maxX).toBeCloseTo(camera.x + 800 / camera.zoom, 10);
    expect(bounds.maxY).toBeCloseTo(camera.y + 600 / camera.zoom, 10);
  });
});

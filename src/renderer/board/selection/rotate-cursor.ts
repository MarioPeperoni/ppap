const ARC = 'M5.2 14.63A9 9 0 0 1 22.8 14.63';
const HEAD_LEFT = 'M4.75 18.8 2.65 13.15 8.01 13.73Z';
const HEAD_RIGHT = 'M23.25 18.8 25.35 13.15 19.99 13.73Z';

function layer(color: string, width: number): string {
  return (
    `<g stroke="${color}" fill="${color}" stroke-width="${width}" ` +
    'stroke-linejoin="round" stroke-linecap="round">' +
    `<path fill="none" d="${ARC}"/><path d="${HEAD_LEFT}"/><path d="${HEAD_RIGHT}"/></g>`
  );
}

/** One bowed arrow with a head at either end, haloed so it reads on either canvas. */
const ROTATE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
  layer('#ffffff', 3.4) +
  layer('#111111', 1.6) +
  '</svg>';

export const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(ROTATE_ICON)}") 14 14, grab`;

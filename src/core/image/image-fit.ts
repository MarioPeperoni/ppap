import { IMAGE_MAX_SIZE } from '@/constants/image.constants';
import type { Size } from '@/types';

export function fitImageSize(naturalWidth: number, naturalHeight: number): Size {
  const longest = Math.max(naturalWidth, naturalHeight);
  const scale = longest > IMAGE_MAX_SIZE ? IMAGE_MAX_SIZE / longest : 1;

  return { width: naturalWidth * scale, height: naturalHeight * scale };
}

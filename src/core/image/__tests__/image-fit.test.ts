import { describe, expect, it } from 'vitest';
import { IMAGE_MAX_SIZE } from '@/constants/image.constants';
import { fitImageSize } from '@/core/image/image-fit';

describe('image fit', () => {
  it('keeps an image that already fits', () => {
    expect(fitImageSize(320, 200)).toEqual({ width: 320, height: 200 });
  });

  it('fits a large image within the limit, preserving the aspect ratio', () => {
    const size = fitImageSize(4000, 2000);

    expect(size.width).toBe(IMAGE_MAX_SIZE);
    expect(size.height).toBe(IMAGE_MAX_SIZE / 2);
  });

  it('fits by the taller side', () => {
    const size = fitImageSize(1000, 2000);

    expect(size.width).toBe(IMAGE_MAX_SIZE / 2);
    expect(size.height).toBe(IMAGE_MAX_SIZE);
  });
});

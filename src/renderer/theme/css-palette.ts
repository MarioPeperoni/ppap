import { LIGHT_PALETTE } from '@/constants/palette.constants';
import { isHexColor } from '@/core/color/srgb';
import type { HexColor, Palette } from '@/types';

class CssPalette {
  private cached: Palette | null = null;

  read(): Palette {
    if (this.cached !== null) return this.cached;

    const styles = getComputedStyle(document.documentElement);
    this.cached = {
      ink: this.token(styles, '--color-ink', LIGHT_PALETTE.ink),
      blue: this.token(styles, '--color-blue', LIGHT_PALETTE.blue),
      red: this.token(styles, '--color-red', LIGHT_PALETTE.red),
      green: this.token(styles, '--color-green', LIGHT_PALETTE.green),
      violet: this.token(styles, '--color-violet', LIGHT_PALETTE.violet),
      orange: this.token(styles, '--color-orange', LIGHT_PALETTE.orange),
      canvas: this.token(styles, '--color-canvas', LIGHT_PALETTE.canvas),
      dots: this.token(styles, '--color-dots', LIGHT_PALETTE.dots),
    };

    return this.cached;
  }

  invalidate(): void {
    this.cached = null;
  }

  private token(styles: CSSStyleDeclaration, name: string, fallback: HexColor): HexColor {
    const value = styles.getPropertyValue(name).trim();

    return isHexColor(value) ? value : fallback;
  }
}

export const cssPalette = new CssPalette();

import type { Palette } from '@/types';

class CssPalette {
  private cached: Palette | null = null;

  read(): Palette {
    if (this.cached !== null) return this.cached;

    const styles = getComputedStyle(document.documentElement);
    this.cached = {
      ink: this.token(styles, '--color-ink'),
      blue: this.token(styles, '--color-blue'),
      red: this.token(styles, '--color-red'),
      green: this.token(styles, '--color-green'),
      canvas: this.token(styles, '--color-canvas'),
      dots: this.token(styles, '--color-dots'),
    };

    return this.cached;
  }

  invalidate(): void {
    this.cached = null;
  }

  private token(styles: CSSStyleDeclaration, name: string): string {
    return styles.getPropertyValue(name).trim();
  }
}

export const cssPalette = new CssPalette();

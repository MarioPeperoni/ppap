import type { ReactElement } from 'react';
import mark from '~/assets/mark.png';

interface BrandMarkProps {
  size: number;
}

export function BrandMark({ size }: BrandMarkProps): ReactElement {
  return <img src={mark} width={size} height={size} alt="" draggable={false} />;
}

import type { Element } from '@/types';

export function assetIdsOf(elements: Iterable<Element>): Set<string> {
  const ids = new Set<string>();

  for (const element of elements) {
    if (element.type === 'image') ids.add(element.assetId);
  }

  return ids;
}

import type { Scene } from '@/types';

export function retainExisting(selection: ReadonlySet<string>, scene: Scene): ReadonlySet<string> {
  const kept = [...selection].filter((id) => scene.has(id));

  return kept.length === selection.size ? selection : new Set(kept);
}

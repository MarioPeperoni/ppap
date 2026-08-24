import type { Subscribable } from '@/types';

export function watchStore<T, S>(
  store: Subscribable<T>,
  select: (state: T) => S,
  run: (value: S) => void,
): () => void {
  let current = select(store.getState());

  return store.subscribe((state) => {
    const next = select(state);
    if (Object.is(next, current)) return;

    current = next;
    run(next);
  });
}

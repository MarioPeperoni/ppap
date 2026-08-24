export interface Subscribable<T> {
  getState: () => T;
  subscribe: (listener: (state: T, previous: T) => void) => () => void;
}

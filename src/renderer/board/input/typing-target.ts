const EDITABLE_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || EDITABLE_TAGS.includes(target.tagName);
}

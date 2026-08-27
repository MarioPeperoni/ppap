import type { KeyEventLike, KeyModifier, KeyStroke, Platform, StrokeParts } from '@/types';

const MODIFIER_ORDER: readonly KeyModifier[] = ['ctrl', 'alt', 'shift'];

const MODIFIER_KEYS: readonly string[] = [
  'control',
  'alt',
  'shift',
  'meta',
  'capslock',
  'altgraph',
];

const MAC_MODIFIER_LABELS: Record<KeyModifier, string> = { ctrl: '⌘', alt: '⌥', shift: '⇧' };

const MODIFIER_LABELS: Record<KeyModifier, string> = { ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift' };

const KEY_LABELS: Record<string, string> = {
  space: 'Space',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  arrowdown: '↓',
};

export function isModifierKey(key: string): boolean {
  return MODIFIER_KEYS.includes(key.toLowerCase());
}

function normalizeKey(key: string): string {
  return key === ' ' ? 'space' : key.toLowerCase();
}

export function strokeFromEvent(event: KeyEventLike): KeyStroke {
  if (isModifierKey(event.key)) return '';

  const modifiers: KeyModifier[] = [];

  if (event.ctrlKey || event.metaKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey) modifiers.push('shift');

  return [...modifiers, normalizeKey(event.key)].join('+');
}

export function splitStroke(stroke: KeyStroke): StrokeParts {
  const modifiers: KeyModifier[] = [];
  let rest = stroke;

  for (const modifier of MODIFIER_ORDER) {
    const prefix = `${modifier}+`;
    if (!rest.startsWith(prefix)) continue;

    modifiers.push(modifier);
    rest = rest.slice(prefix.length);
  }

  return { modifiers, key: rest };
}

export function isValidStroke(stroke: KeyStroke): boolean {
  const { key } = splitStroke(stroke);

  if (key.length === 0 || key !== normalizeKey(key) || isModifierKey(key)) return false;

  return key === '+' || !key.includes('+');
}

function titleCase(key: string): string {
  return key.slice(0, 1).toUpperCase() + key.slice(1);
}

function keyLabel(key: string): string {
  return KEY_LABELS[key] ?? (key.length === 1 ? key.toUpperCase() : titleCase(key));
}

export function formatStroke(stroke: KeyStroke, platform: Platform): string {
  if (stroke === '') return '';

  const { modifiers, key } = splitStroke(stroke);
  const onMac = platform === 'darwin';
  const labels = modifiers.map((modifier) =>
    onMac ? MAC_MODIFIER_LABELS[modifier] : MODIFIER_LABELS[modifier],
  );

  return onMac ? `${labels.join('')}${keyLabel(key)}` : [...labels, keyLabel(key)].join('+');
}

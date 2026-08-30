import { TOOL_IDS } from '@/constants/tool.constants';
import type { ActionGroup, ActionId, BindSlot, Keymap, KeyStroke, ToolAction } from '@/types';

const TOOL_ACTIONS: readonly ToolAction[] = TOOL_IDS.map((id): ToolAction => `tool.${id}`);

export const ACTION_IDS: readonly ActionId[] = [
  ...TOOL_ACTIONS,
  'color.next',
  'color.previous',
  'color.swap',
  'width.decrease',
  'width.increase',
  'selection.delete',
];

export const BIND_SLOTS: readonly BindSlot[] = ['primary', 'secondary'];

export const SLOT_LABELS: Record<BindSlot, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
};

export const DEFAULT_KEYMAP: Keymap = {
  'tool.pen': { primary: 'p', secondary: '1' },
  'tool.pencil': { primary: 'n', secondary: '2' },
  'tool.text': { primary: 't', secondary: '3' },
  'tool.eraser': { primary: 'e', secondary: '4' },
  'tool.marquee': { primary: 'v', secondary: '5' },
  'tool.lasso': { primary: 'l', secondary: '6' },
  'tool.hand': { primary: 'h', secondary: '7' },
  'color.next': { primary: 'c', secondary: '' },
  'color.previous': { primary: 'shift+c', secondary: '' },
  'color.swap': { primary: 'x', secondary: '' },
  'width.decrease': { primary: '[', secondary: '' },
  'width.increase': { primary: ']', secondary: '' },
  'selection.delete': { primary: 'backspace', secondary: 'delete' },
};

export const ACTION_LABELS: Record<ActionId, string> = {
  'tool.pen': 'Pen',
  'tool.pencil': 'Pencil',
  'tool.text': 'Text',
  'tool.eraser': 'Eraser',
  'tool.marquee': 'Marquee',
  'tool.lasso': 'Lasso',
  'tool.hand': 'Hand',
  'color.next': 'Next color',
  'color.previous': 'Previous color',
  'color.swap': 'Swap colors',
  'width.decrease': 'Thinner',
  'width.increase': 'Thicker',
  'selection.delete': 'Delete selection',
};

export const ACTION_GROUPS: readonly ActionGroup[] = [
  { label: 'Tools', actions: TOOL_ACTIONS },
  { label: 'Color', actions: ['color.next', 'color.previous', 'color.swap'] },
  { label: 'Stroke', actions: ['width.decrease', 'width.increase'] },
  { label: 'Selection', actions: ['selection.delete'] },
];

export const FIXED_LABELS: Record<KeyStroke, string> = {
  space: 'Temporary pan',
  escape: 'Cancel gesture',
};

export const SHORTCUT_LABELS: Record<KeyStroke, string> = {
  'ctrl+z': 'Undo',
  'ctrl+shift+z': 'Redo',
  'ctrl+y': 'Redo',
  'ctrl+a': 'Select all',
  'ctrl+c': 'Copy',
  'ctrl+x': 'Cut',
  'ctrl+v': 'Paste',
  'ctrl+d': 'Duplicate',
  'ctrl+g': 'Toggle grid',
  'ctrl+s': 'Save',
  'ctrl+n': 'New board',
  'ctrl+0': 'Reset zoom',
  'ctrl+1': 'Fit content',
  'ctrl+=': 'Zoom in',
  'ctrl+shift++': 'Zoom in',
  'ctrl+-': 'Zoom out',
  'ctrl+shift+_': 'Zoom out',
  f2: 'Rename board',
  'alt+arrowleft': 'Back to the library',
};

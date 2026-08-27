import type { ToolId } from './tool.types';

export type ToolAction = `tool.${ToolId}`;

export type ActionId =
  | ToolAction
  | 'color.next'
  | 'color.previous'
  | 'color.swap'
  | 'width.decrease'
  | 'width.increase'
  | 'selection.delete';

export type KeyStroke = string;

export type BindSlot = 'primary' | 'secondary';

export type KeyBinding = Record<BindSlot, KeyStroke>;

export type Keymap = Record<ActionId, KeyBinding>;

export interface BindTarget {
  action: ActionId;
  slot: BindSlot;
}

export type KeyModifier = 'ctrl' | 'alt' | 'shift';

export interface KeyEventLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

export interface StrokeParts {
  modifiers: readonly KeyModifier[];
  key: string;
}

export interface ActionGroup {
  label: string;
  actions: readonly ActionId[];
}

export type BindVerdict =
  | { kind: 'ok' }
  | { kind: 'fixed'; owner: string }
  | { kind: 'overrides'; owner: string }
  | { kind: 'steals'; owner: ActionId };

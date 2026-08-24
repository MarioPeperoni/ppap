function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);

  return value;
}

export function expectArray(value: unknown, label: string): unknown[] {
  if (!isUnknownArray(value)) throw new Error(`${label} must be an array`);

  return value;
}

export function expectString(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new Error(`${label} must be a string`);

  return value;
}

export function expectNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }

  return value;
}

export function expectBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`${label} must be a boolean`);

  return value;
}

export function expectOneOf<T>(value: unknown, allowed: readonly T[], label: string): T {
  const match = allowed.find((candidate) => candidate === value);
  if (match === undefined) throw new Error(`${label} is not a known value`);

  return match;
}

export function expectBytes(value: unknown, label: string, maxBytes: number): Uint8Array {
  if (!(value instanceof Uint8Array)) throw new Error(`${label} must be a byte array`);
  if (value.byteLength > maxBytes) throw new Error(`${label} exceeds ${maxBytes} bytes`);

  return value;
}

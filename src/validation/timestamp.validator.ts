import { expectString } from '@/validation/primitive.validator';

export function parseTimestamp(value: unknown, label: string): string {
  const text = expectString(value, label);
  if (Number.isNaN(Date.parse(text))) throw new Error(`${label} is not an ISO date`);

  return text;
}

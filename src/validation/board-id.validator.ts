import { BOARD_ID_PATTERN, MAX_BOARD_NAME_LENGTH } from '@/constants/library.constants';
import { expectString } from '@/validation/primitive.validator';

export function parseBoardId(value: unknown): string {
  const id = expectString(value, 'Board id');
  if (!BOARD_ID_PATTERN.test(id)) throw new Error('Board id is malformed');

  return id;
}

export function parseBoardName(value: unknown): string {
  const name = expectString(value, 'Board name').trim();
  if (name.length === 0) throw new Error('Board name is empty');

  return name.slice(0, MAX_BOARD_NAME_LENGTH);
}

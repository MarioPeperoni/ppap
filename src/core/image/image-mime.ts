import type { ImageMime } from '@/types';

interface MagicBytes {
  offset: number;
  bytes: readonly number[];
}

interface ImageSignature {
  mime: ImageMime;
  magic: readonly MagicBytes[];
}

const SIGNATURES: readonly ImageSignature[] = [
  {
    mime: 'image/png',
    magic: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  },
  { mime: 'image/jpeg', magic: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  { mime: 'image/gif', magic: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] },
  {
    mime: 'image/webp',
    magic: [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    ],
  },
  { mime: 'image/bmp', magic: [{ offset: 0, bytes: [0x42, 0x4d] }] },
];

function matches(source: Uint8Array, magic: MagicBytes): boolean {
  return magic.bytes.every((byte, index) => source[magic.offset + index] === byte);
}

export function sniffImageMime(bytes: Uint8Array): ImageMime | null {
  const signature = SIGNATURES.find((candidate) =>
    candidate.magic.every((magic) => matches(bytes, magic)),
  );

  return signature?.mime ?? null;
}

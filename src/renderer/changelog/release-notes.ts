import markdown from '~/CHANGELOG.md?raw';
import { findRelease, parseChangelog } from '@/core/changelog/changelog-parse';
import type { Release } from '@/types';

const RELEASES = parseChangelog(markdown);

export function releaseNotes(version: string): Release | null {
  return findRelease(RELEASES, version);
}

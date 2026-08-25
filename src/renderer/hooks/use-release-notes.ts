import { releaseNotes } from '@/renderer/changelog/release-notes';
import { useAppVersion } from '@/renderer/hooks/use-app-version';
import type { Release } from '@/types';

export function useReleaseNotes(): Release | null {
  const version = useAppVersion();

  return releaseNotes(version);
}

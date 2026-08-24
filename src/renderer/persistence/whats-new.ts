import { releaseNotes } from '@/renderer/changelog/release-notes';

export async function hasUnseenRelease(): Promise<boolean> {
  const [version, settings] = await Promise.all([
    window.ppap.app.version(),
    window.ppap.settings.get(),
  ]);

  if (settings.lastSeenVersion === version) return false;

  window.ppap.settings.patch({ lastSeenVersion: version });

  return releaseNotes(version) !== null;
}

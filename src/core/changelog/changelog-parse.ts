import type { Release, ReleaseSection } from '@/types';

const RELEASE_HEADING = /^##\s+v?(\S+)(?:\s*[—–-]\s*(.+))?$/;
const SECTION_HEADING = /^###\s+(.+)$/;
const ITEM = /^[-*]\s+(.+)$/;

function openSection(release: Release): ReleaseSection {
  const open = release.sections.at(-1);
  if (open !== undefined) return open;

  const untitled: ReleaseSection = { title: '', items: [] };
  release.sections.push(untitled);

  return untitled;
}

export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];

  for (const raw of markdown.split('\n')) {
    const line = raw.trim();

    const heading = RELEASE_HEADING.exec(line);
    if (heading !== null) {
      const [, version = '', date = ''] = heading;

      releases.push({ version, date: date.trim(), sections: [] });
      continue;
    }

    const release = releases.at(-1);
    if (release === undefined) continue;

    const section = SECTION_HEADING.exec(line);
    if (section !== null) {
      const [, title = ''] = section;

      release.sections.push({ title: title.trim(), items: [] });
      continue;
    }

    const item = ITEM.exec(line);
    if (item !== null) {
      const [, text = ''] = item;

      openSection(release).items.push(text.trim());
    }
  }

  return releases;
}

export function findRelease(releases: readonly Release[], version: string): Release | null {
  return releases.find((release) => release.version === version) ?? null;
}

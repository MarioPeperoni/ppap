import { describe, expect, it } from 'vitest';
import { findRelease, parseChangelog } from '@/core/changelog/changelog-parse';

const CHANGELOG = `# Changelog

Every release, in plain language.

## 1.1.0 — 2026-08-24

### Added

- A What's new window.
- Another line.

### Fixed

- A crash on export.

## v1.0.0 - 2026-08-20

- Shipped the first build.
`;

describe('changelog parsing', () => {
  it('reads a release with its date and grouped items', () => {
    const [release] = parseChangelog(CHANGELOG);

    expect(release?.version).toBe('1.1.0');
    expect(release?.date).toBe('2026-08-24');
    expect(release?.sections).toEqual([
      { title: 'Added', items: ["A What's new window.", 'Another line.'] },
      { title: 'Fixed', items: ['A crash on export.'] },
    ]);
  });

  it('drops the v prefix and accepts a hyphen before the date', () => {
    const release = parseChangelog(CHANGELOG)[1];

    expect(release?.version).toBe('1.0.0');
    expect(release?.date).toBe('2026-08-20');
  });

  it('keeps items written without a section', () => {
    const release = parseChangelog(CHANGELOG)[1];

    expect(release?.sections).toEqual([{ title: '', items: ['Shipped the first build.'] }]);
  });

  it('ignores everything above the first release', () => {
    expect(parseChangelog('# Changelog\n\n- Not a release item.\n')).toEqual([]);
  });

  it('finds a release by version', () => {
    const releases = parseChangelog(CHANGELOG);

    expect(findRelease(releases, '1.0.0')?.version).toBe('1.0.0');
    expect(findRelease(releases, '9.9.9')).toBeNull();
  });
});

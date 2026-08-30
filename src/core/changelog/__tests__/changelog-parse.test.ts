import { describe, expect, it } from 'vitest';
import { findRelease, parseChangelog } from '@/core/changelog/changelog-parse';

const CHANGELOG = `## 1.1.0 — Pencil and zoom

### Added

- A What's new window.
- Another line.

### Fixed

- A crash on export.

## 1.0.1

- Shipped a fix.

## v1.0.0 - Canvas, pen and boards

### Added

- The first build.
`;

describe('changelog parsing', () => {
  it('reads a release with its subtitle and grouped items', () => {
    const [release] = parseChangelog(CHANGELOG);

    expect(release?.version).toBe('1.1.0');
    expect(release?.subtitle).toBe('Pencil and zoom');
    expect(release?.sections).toEqual([
      { title: 'Added', items: ["A What's new window.", 'Another line.'] },
      { title: 'Fixed', items: ['A crash on export.'] },
    ]);
  });

  it('leaves the subtitle out of a release written without one', () => {
    const release = parseChangelog(CHANGELOG)[1];

    expect(release?.version).toBe('1.0.1');
    expect(release?.subtitle).toBeUndefined();
  });

  it('drops the v prefix and accepts a hyphen before the subtitle', () => {
    const release = parseChangelog(CHANGELOG)[2];

    expect(release?.version).toBe('1.0.0');
    expect(release?.subtitle).toBe('Canvas, pen and boards');
  });

  it('keeps items written without a section', () => {
    const release = parseChangelog(CHANGELOG)[1];

    expect(release?.sections).toEqual([{ title: '', items: ['Shipped a fix.'] }]);
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

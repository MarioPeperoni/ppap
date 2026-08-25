import { readFile } from 'node:fs/promises';
import { app } from 'electron';
import { DEFAULT_SETTINGS } from '@/constants/settings.constants';
import { writeAtomic } from '@/main/library/atomic-write';
import { ensureLibrary, settingsPath } from '@/main/library/library-paths';
import { saveQueue } from '@/main/library/save-queue';
import type { Settings, SettingsPatch } from '@/types';
import { parseSettings } from '@/validation/settings.validator';

const SETTINGS_KEY = 'settings';

class SettingsService {
  private current: Promise<Settings> | null = null;

  get(): Promise<Settings> {
    this.current ??= this.read();

    return this.current;
  }

  async patch(patch: SettingsPatch): Promise<Settings> {
    const next: Settings = { ...(await this.get()), ...patch };

    this.current = Promise.resolve(next);
    this.persist(next);

    return next;
  }

  private async read(): Promise<Settings> {
    await ensureLibrary();

    try {
      const parsed: unknown = JSON.parse(await readFile(settingsPath(), 'utf8'));

      return parseSettings(parsed);
    } catch {
      return this.freshInstall();
    }
  }

  private freshInstall(): Settings {
    const settings: Settings = { ...DEFAULT_SETTINGS, lastSeenVersion: app.getVersion() };

    this.persist(settings);

    return settings;
  }

  private persist(settings: Settings): void {
    const snapshot = JSON.stringify(settings);

    void saveQueue.push(SETTINGS_KEY, () => writeAtomic(settingsPath(), snapshot));
  }
}

export const settingsService = new SettingsService();

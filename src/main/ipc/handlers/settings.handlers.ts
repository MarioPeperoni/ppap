import { IPC_CHANNELS } from '@/constants/ipc.constants';
import { settingsService } from '@/main/settings/settings.service';
import { themeService } from '@/main/theme/theme.service';
import type { IpcInvokeTable, IpcSendTable } from '@/types/main-ipc.types';
import { parseSettingsPatch } from '@/validation/settings.validator';

export const settingsSendHandlers: IpcSendTable = {
  [IPC_CHANNELS.settingsPatch]: (_window, payload) => {
    const { theme, ...rest } = parseSettingsPatch(payload);

    if (theme !== undefined) themeService.set(theme);
    void settingsService.patch(rest);
  },
};

export const settingsInvokeHandlers: IpcInvokeTable = {
  [IPC_CHANNELS.settingsGet]: () => settingsService.get(),
};

export const IPC_CHANNELS = {
  windowMinimize: 'window:minimize',
  windowToggleMaximize: 'window:toggle-maximize',
  windowClose: 'window:close',
  windowMaximizeChanged: 'window:maximize-changed',
  themeGet: 'theme:get',
  themeSet: 'theme:set',
  themeChanged: 'theme:changed',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

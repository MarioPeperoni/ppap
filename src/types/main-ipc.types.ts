import type { BrowserWindow } from 'electron';
import type { IpcChannel } from '@/constants/ipc.constants';

export type IpcSendHandler = (window: BrowserWindow, payload: unknown) => void;

export type IpcInvokeHandler = () => unknown;

export type IpcSendTable = Partial<Record<IpcChannel, IpcSendHandler>>;

export type IpcInvokeTable = Partial<Record<IpcChannel, IpcInvokeHandler>>;

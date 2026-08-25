import { create } from 'zustand';
import { DEFAULT_WHEEL_ACTION } from '@/constants/camera.constants';
import type { Settings, WheelAction } from '@/types';

interface InputStore {
  wheelAction: WheelAction;
  adopt: (settings: Settings) => void;
  setWheelAction: (action: WheelAction) => void;
}

export const useInputStore = create<InputStore>()((set) => ({
  wheelAction: DEFAULT_WHEEL_ACTION,

  adopt: ({ wheelAction }) => {
    set({ wheelAction });
  },

  setWheelAction: (wheelAction) => {
    set({ wheelAction });
  },
}));

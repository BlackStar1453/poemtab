import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type Theme = 'light' | 'dark';
type UpdateFrequency = 'every_tab' | 'every_10min' | 'every_hour' | 'every_day';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<Theme>('theme-storage-key', 'light', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// Theme storage
export const exampleThemeStorage: ThemeStorage = {
  ...storage,
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};

// Update frequency storage
const updateFrequency = createStorage<UpdateFrequency>('update-frequency-storage-key', 'every_tab', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const poemLanguageStorage = createStorage<'chinese' | 'english'>('poem_language', 'chinese')

export const updateFrequencyStorage: BaseStorage<UpdateFrequency> = {
  ...updateFrequency,
};

// Last update time storage
const lastUpdateTime = createStorage<number>('last-update-time-storage-key', 0, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const lastUpdateTimeStorage: BaseStorage<number> = {
  ...lastUpdateTime,
};

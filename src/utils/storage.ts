import { ApprovalItem, NotificationItem, StorageData } from '@/types/approval';

const STORAGE_KEY = 'approval_storage_data_v1';

const getLocalStorage = (): StorageData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_e) {
    console.log('[Storage] localStorage read failed');
  }
  return null;
};

const setLocalStorage = (data: StorageData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {
    console.error('[Storage] localStorage write failed');
  }
};

const removeLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_e) {
    console.error('[Storage] localStorage remove failed');
  }
};

export const storageUtils = {
  async saveData(data: StorageData): Promise<void> {
    const saveData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    setLocalStorage(saveData);

    try {
      const Taro = require('@tarojs/taro');
      await Taro.default.setStorage({
        key: STORAGE_KEY,
        data: saveData
      });
    } catch (_e) {
      console.log('[Storage] Taro.setStorage skipped');
    }
  },

  async loadData(): Promise<StorageData | null> {
    const localData = getLocalStorage();
    if (localData) {
      return localData;
    }

    try {
      const Taro = require('@tarojs/taro');
      const result = await Taro.default.getStorage({ key: STORAGE_KEY });
      if (result.data) {
        setLocalStorage(result.data);
        return result.data;
      }
    } catch (_e) {
      console.log('[Storage] Taro.getStorage empty');
    }

    return null;
  },

  async clearData(): Promise<void> {
    removeLocalStorage();

    try {
      const Taro = require('@tarojs/taro');
      await Taro.default.removeStorage({ key: STORAGE_KEY });
    } catch (_e) {
      console.log('[Storage] Taro.removeStorage skipped');
    }
  },

  async savePendingList(list: ApprovalItem[]): Promise<void> {
    const data = await this.loadData();
    if (data) {
      data.pendingList = list;
      await this.saveData(data);
    }
  },

  async saveHistoryList(list: ApprovalItem[]): Promise<void> {
    const data = await this.loadData();
    if (data) {
      data.historyList = list;
      await this.saveData(data);
    }
  },

  async saveNotificationList(list: NotificationItem[]): Promise<void> {
    const data = await this.loadData();
    if (data) {
      data.notificationList = list;
      await this.saveData(data);
    }
  },

  async initStorage(
    pendingList: ApprovalItem[],
    historyList: ApprovalItem[],
    notificationList: NotificationItem[]
  ): Promise<StorageData> {
    const existingData = await this.loadData();
    if (existingData) {
      return existingData;
    }

    const initialData: StorageData = {
      pendingList,
      historyList,
      notificationList,
      lastUpdated: new Date().toISOString()
    };

    await this.saveData(initialData);
    return initialData;
  }
};

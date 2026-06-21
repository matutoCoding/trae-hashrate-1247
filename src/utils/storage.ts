import Taro from '@tarojs/taro';
import { ApprovalItem, NotificationItem, StorageData } from '@/types/approval';

const STORAGE_KEY = 'approval_storage_data_v1';

export const storageUtils = {
  async saveData(data: StorageData): Promise<void> {
    try {
      await Taro.setStorage({
        key: STORAGE_KEY,
        data: {
          ...data,
          lastUpdated: new Date().toISOString()
        }
      });
      console.log('[Storage] 数据已保存');
    } catch (error) {
      console.error('[Storage] 保存数据失败:', error);
    }
  },

  async loadData(): Promise<StorageData | null> {
    try {
      const result = await Taro.getStorage({ key: STORAGE_KEY });
      if (result.data) {
        console.log('[Storage] 数据已加载');
        return result.data;
      }
      return null;
    } catch (error) {
      console.log('[Storage] 无本地缓存数据');
      return null;
    }
  },

  async clearData(): Promise<void> {
    try {
      await Taro.removeStorage({ key: STORAGE_KEY });
      console.log('[Storage] 数据已清除');
    } catch (error) {
      console.error('[Storage] 清除数据失败:', error);
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
      console.log('[Storage] 使用现有缓存数据');
      return existingData;
    }

    const initialData: StorageData = {
      pendingList,
      historyList,
      notificationList,
      lastUpdated: new Date().toISOString()
    };

    await this.saveData(initialData);
    console.log('[Storage] 初始化数据已保存');
    return initialData;
  }
};

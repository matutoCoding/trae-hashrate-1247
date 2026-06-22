import { create } from 'zustand';
import { ApprovalItem, DecisionType, ProjectGroup, NotificationItem, NotificationType, ApproverInfo, TransferRecord } from '@/types/approval';
import { pendingApprovals, decisionHistory, notificationList as initialNotificationList, approverList, currentUser } from '@/data/mockData';
import { storageUtils } from '@/utils/storage';
import { dateUtils } from '@/utils/date';

interface ApprovalStore {
  pendingList: ApprovalItem[];
  historyList: ApprovalItem[];
  notificationList: NotificationItem[];
  selectedProject: string | null;
  selectedLevel: string | null;
  isInitialized: boolean;

  initStore: () => Promise<void>;
  setSelectedProject: (project: string | null) => void;
  setSelectedLevel: (level: string | null) => void;

  getFilteredPendingList: () => ApprovalItem[];
  getProjectGroups: (list: ApprovalItem[]) => ProjectGroup[];
  getApprovalById: (id: string) => ApprovalItem | undefined;
  getApproverList: () => ApproverInfo[];
  getUnreadNotificationCount: () => number;

  makeDecision: (id: string, decision: DecisionType, reason: string, deadline?: string) => void;
  transferApproval: (id: string, toApproverId: string, toApproverName: string, reason: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  checkAndUpdateExpiredItems: () => void;
  clearStorage: () => Promise<void>;
}

const saveToStorage = async (
  pendingList: ApprovalItem[],
  historyList: ApprovalItem[],
  notificationList: NotificationItem[]
) => {
  try {
    await storageUtils.saveData({
      pendingList,
      historyList,
      notificationList,
      lastUpdated: new Date().toISOString()
    });
  } catch (_error) {
    console.error('[Store] saveToStorage failed');
  }
};

const generateNotificationId = () => {
  return 'NOT' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const createNotification = (
  item: ApprovalItem,
  decision: DecisionType,
  reason: string,
  deadline?: string
): NotificationItem => {
  const now = dateUtils.getCurrentDateTime();

  return {
    id: generateNotificationId(),
    type: 'approval-result' as NotificationType,
    title: '审批结果通知',
    fileName: item.fileName,
    fileId: 'FILE' + item.id,
    approvalId: item.id,
    decision,
    decisionReason: reason,
    decisionTime: now,
    deadline,
    fromUser: currentUser.name,
    toUserId: item.applicant.id,
    status: 'notified',
    createTime: now,
    projectName: item.projectName,
    level: item.level
  };
};

const createTransferNotification = (
  item: ApprovalItem,
  transferRecord: TransferRecord
): NotificationItem => {
  const now = dateUtils.getCurrentDateTime();

  return {
    id: generateNotificationId(),
    type: 'transfer' as NotificationType,
    title: '审批转交通知',
    fileName: item.fileName,
    fileId: 'FILE' + item.id,
    approvalId: item.id,
    decisionReason: transferRecord.transferReason,
    decisionTime: now,
    fromUser: transferRecord.fromApproverName,
    toUserId: transferRecord.toApproverId,
    status: 'notified',
    createTime: now,
    projectName: item.projectName,
    level: item.level
  };
};

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  pendingList: pendingApprovals,
  historyList: decisionHistory,
  notificationList: initialNotificationList,
  selectedProject: null,
  selectedLevel: null,
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return;

    try {
      const storedData = await storageUtils.loadData();
      if (storedData) {
        const pendingList = storedData.pendingList.map(item => {
          if (item.deadline && dateUtils.isExpired(item.deadline)) {
            return { ...item, status: 'expired' as const };
          }
          return item;
        });

        const historyList = storedData.historyList.map(item => {
          if (item.deadline && dateUtils.isExpired(item.deadline) && item.status === 'time-limited') {
            return { ...item, status: 'expired' as const };
          }
          return item;
        });

        set({
          pendingList,
          historyList,
          notificationList: storedData.notificationList,
          isInitialized: true
        });

        console.log('[Store] initStore from storage, pending:', pendingList.length, 'history:', historyList.length);
      } else {
        set({ isInitialized: true });
        console.log('[Store] initStore from mock data, pending:', get().pendingList.length, 'history:', get().historyList.length);
      }
    } catch (_error) {
      set({ isInitialized: true });
      console.log('[Store] initStore fallback to mock data');
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),

  getFilteredPendingList: () => {
    const { pendingList, selectedProject, selectedLevel } = get();
    let filtered = [...pendingList];

    if (selectedProject) {
      filtered = filtered.filter((item) => item.projectId === selectedProject);
    }
    if (selectedLevel) {
      filtered = filtered.filter((item) => item.level === selectedLevel);
    }

    return filtered;
  },

  getProjectGroups: (list) => {
    const groups: { [key: string]: ProjectGroup } = {};

    list.forEach((item) => {
      if (!groups[item.projectId]) {
        groups[item.projectId] = {
          projectId: item.projectId,
          projectName: item.projectName,
          count: 0,
          items: []
        };
      }
      groups[item.projectId].count++;
      groups[item.projectId].items.push(item);
    });

    return Object.values(groups);
  },

  getApprovalById: (id) => {
    const { pendingList, historyList } = get();
    return pendingList.find((item) => item.id === id) || historyList.find((item) => item.id === id);
  },

  getApproverList: () => {
    return approverList.filter(a => a.id !== currentUser.id);
  },

  getUnreadNotificationCount: () => {
    const { notificationList } = get();
    return notificationList.filter(n => n.status === 'unread').length;
  },

  makeDecision: (id, decision, reason, deadline) => {
    const { pendingList, historyList, notificationList } = get();
    const itemIndex = pendingList.findIndex((item) => item.id === id);

    if (itemIndex === -1) return;

    const item = pendingList[itemIndex];
    const now = dateUtils.getCurrentDateTime();

    let status: ApprovalItem['status'];
    switch (decision) {
      case 'approve':
        status = 'approved';
        break;
      case 'reject':
        status = 'rejected';
        break;
      case 'time-limited':
        status = 'time-limited';
        break;
      case 'online-only':
        status = 'online-only';
        break;
      default:
        status = 'approved';
    }

    const decidedItem: ApprovalItem = {
      ...item,
      status,
      decision,
      decisionReason: reason,
      decisionTime: now,
      deadline: decision === 'time-limited' ? deadline : undefined,
      notificationStatus: 'notified'
    };

    const newPendingList = [...pendingList];
    newPendingList.splice(itemIndex, 1);

    const notification = createNotification(item, decision, reason, deadline);
    const newNotificationList = [notification, ...notificationList];
    const newHistoryList = [decidedItem, ...historyList];

    set({
      pendingList: newPendingList,
      historyList: newHistoryList,
      notificationList: newNotificationList
    });

    saveToStorage(newPendingList, newHistoryList, newNotificationList);

    console.log('[Store] makeDecision', { id, decision, reason, deadline });
  },

  transferApproval: (id, toApproverId, toApproverName, reason) => {
    const { pendingList, historyList, notificationList } = get();
    const itemIndex = pendingList.findIndex((item) => item.id === id);

    if (itemIndex === -1) return;

    const item = pendingList[itemIndex];
    const now = dateUtils.getCurrentDateTime();

    const transferRecord: TransferRecord = {
      fromApproverId: currentUser.id,
      fromApproverName: currentUser.name,
      toApproverId,
      toApproverName,
      transferReason: reason,
      transferTime: now
    };

    const transferredItem: ApprovalItem = {
      ...item,
      status: 'transferred',
      transferRecord,
      notificationStatus: 'notified'
    };

    const newPendingList = [...pendingList];
    newPendingList.splice(itemIndex, 1);

    const newHistoryList = [transferredItem, ...historyList];

    const notification = createTransferNotification(item, transferRecord);
    const newNotificationList = [notification, ...notificationList];

    set({
      pendingList: newPendingList,
      historyList: newHistoryList,
      notificationList: newNotificationList
    });

    saveToStorage(newPendingList, newHistoryList, newNotificationList);

    console.log('[Store] transferApproval', { id, toApproverId, toApproverName, reason });
  },

  markNotificationRead: (notificationId) => {
    const { notificationList, pendingList, historyList } = get();
    const newNotificationList = notificationList.map(n => {
      if (n.id === notificationId && n.status === 'unread') {
        return {
          ...n,
          status: 'read' as const,
          readTime: dateUtils.getCurrentDateTime()
        };
      }
      return n;
    });

    set({ notificationList: newNotificationList });
    saveToStorage(pendingList, historyList, newNotificationList);
  },

  markAllNotificationsRead: () => {
    const { notificationList, pendingList, historyList } = get();
    const now = dateUtils.getCurrentDateTime();
    const newNotificationList = notificationList.map(n => {
      if (n.status === 'unread') {
        return {
          ...n,
          status: 'read' as const,
          readTime: now
        };
      }
      return n;
    });

    set({ notificationList: newNotificationList });
    saveToStorage(pendingList, historyList, newNotificationList);
  },

  checkAndUpdateExpiredItems: () => {
    const { pendingList, historyList, notificationList } = get();
    let hasChanges = false;

    const updatedPendingList = pendingList.map(item => {
      if (item.deadline && dateUtils.isExpired(item.deadline) && item.status !== 'expired') {
        hasChanges = true;
        return { ...item, status: 'expired' as const };
      }
      return item;
    });

    const updatedHistoryList = historyList.map(item => {
      if (item.deadline && dateUtils.isExpired(item.deadline) && item.status === 'time-limited') {
        hasChanges = true;
        return { ...item, status: 'expired' as const };
      }
      return item;
    });

    if (hasChanges) {
      set({
        pendingList: updatedPendingList,
        historyList: updatedHistoryList
      });
      saveToStorage(updatedPendingList, updatedHistoryList, notificationList);
      console.log('[Store] checkAndUpdateExpiredItems updated');
    }
  },

  clearStorage: async () => {
    await storageUtils.clearData();
    set({
      pendingList: pendingApprovals,
      historyList: decisionHistory,
      notificationList: initialNotificationList,
      isInitialized: false
    });
    console.log('[Store] clearStorage done');
  }
}));

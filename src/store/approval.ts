import { create } from 'zustand';
import { ApprovalItem, DecisionType, ProjectGroup } from '@/types/approval';
import { pendingApprovals, decisionHistory } from '@/data/mockData';

interface ApprovalStore {
  pendingList: ApprovalItem[];
  historyList: ApprovalItem[];
  selectedProject: string | null;
  selectedLevel: string | null;

  setSelectedProject: (project: string | null) => void;
  setSelectedLevel: (level: string | null) => void;

  getFilteredPendingList: () => ApprovalItem[];
  getProjectGroups: (list: ApprovalItem[]) => ProjectGroup[];
  makeDecision: (id: string, decision: DecisionType, reason: string) => void;
  getApprovalById: (id: string) => ApprovalItem | undefined;
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  pendingList: [...pendingApprovals],
  historyList: [...decisionHistory],
  selectedProject: null,
  selectedLevel: null,

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

  makeDecision: (id, decision, reason) => {
    const { pendingList, historyList } = get();
    const itemIndex = pendingList.findIndex((item) => item.id === id);

    if (itemIndex === -1) return;

    const item = pendingList[itemIndex];
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

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
      decisionTime: now
    };

    const newPendingList = [...pendingList];
    newPendingList.splice(itemIndex, 1);

    set({
      pendingList: newPendingList,
      historyList: [decidedItem, ...historyList]
    });

    console.log('[ApprovalStore] 审批完成', { id, decision, reason });
  },

  getApprovalById: (id) => {
    const { pendingList, historyList } = get();
    return pendingList.find((item) => item.id === id) || historyList.find((item) => item.id === id);
  }
}));

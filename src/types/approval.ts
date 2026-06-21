export type ApprovalLevel = 'top-secret' | 'confidential' | 'secret';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'time-limited' | 'online-only' | 'expired' | 'transferred';

export type DecisionType = 'approve' | 'reject' | 'time-limited' | 'online-only';

export type NotificationType = 'approval-result' | 'transfer' | 'system';

export type NotificationStatus = 'unread' | 'read' | 'notified';

export type ProjectOwnership = 'mine' | 'transfer' | 'neutral';

export interface ApplicantInfo {
  id: string;
  name: string;
  department: string;
  avatar: string;
}

export interface ApproverInfo {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  phone?: string;
}

export interface TransferRecord {
  fromApproverId: string;
  fromApproverName: string;
  toApproverId: string;
  toApproverName: string;
  transferReason: string;
  transferTime: string;
}

export interface ApprovalItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  level: ApprovalLevel;
  projectName: string;
  projectId: string;
  applicant: ApplicantInfo;
  purpose: string;
  validFrom: string;
  validTo: string;
  applyTime: string;
  status: ApprovalStatus;
  decision?: DecisionType;
  decisionReason?: string;
  decisionTime?: string;
  deadline?: string;
  transferRecord?: TransferRecord;
  notificationStatus?: NotificationStatus;
  projectOwnership?: ProjectOwnership;
  summary?: string;
  directory?: DirectoryNode[];
  screenshots?: string[];
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  fileName: string;
  fileId: string;
  approvalId: string;
  decision?: DecisionType;
  decisionReason?: string;
  decisionTime?: string;
  deadline?: string;
  fromUser: string;
  toUserId: string;
  status: NotificationStatus;
  createTime: string;
  readTime?: string;
  projectName?: string;
  level?: ApprovalLevel;
}

export interface DirectoryNode {
  name: string;
  type: 'folder' | 'file';
  children?: DirectoryNode[];
}

export interface ProjectGroup {
  projectId: string;
  projectName: string;
  count: number;
  items: ApprovalItem[];
}

export interface StorageData {
  pendingList: ApprovalItem[];
  historyList: ApprovalItem[];
  notificationList: NotificationItem[];
  lastUpdated: string;
}

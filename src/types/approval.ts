export type ApprovalLevel = 'top-secret' | 'confidential' | 'secret';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'time-limited' | 'online-only';

export type DecisionType = 'approve' | 'reject' | 'time-limited' | 'online-only';

export interface ApplicantInfo {
  id: string;
  name: string;
  department: string;
  avatar: string;
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
  summary?: string;
  directory?: DirectoryNode[];
  screenshots?: string[];
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

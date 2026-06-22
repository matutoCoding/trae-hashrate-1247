import { ApprovalItem, DirectoryNode, ApproverInfo, NotificationItem } from '@/types/approval';

const directoryData: DirectoryNode[] = [
  {
    name: '项目资料',
    type: 'folder',
    children: [
      { name: '项目概况.pdf', type: 'file' },
      { name: '技术方案.pdf', type: 'file' },
      { name: '报价明细.xlsx', type: 'file' }
    ]
  },
  {
    name: '合同文件',
    type: 'folder',
    children: [
      { name: '主合同.pdf', type: 'file' },
      { name: '补充协议.pdf', type: 'file' },
      { name: '保密协议.pdf', type: 'file' }
    ]
  },
  {
    name: '财务报表',
    type: 'folder',
    children: [
      { name: '年度报表.xlsx', type: 'file' },
      { name: '季度报表.xlsx', type: 'file' }
    ]
  }
];

const screenshotUrls = [
  'https://picsum.photos/id/1/300/400',
  'https://picsum.photos/id/2/300/400',
  'https://picsum.photos/id/3/300/400'
];

export const pendingApprovals: ApprovalItem[] = [
  {
    id: 'AP001',
    fileName: '某科技公司并购项目尽职调查报告.pdf',
    fileType: 'PDF',
    fileSize: '12.5MB',
    level: 'top-secret',
    projectName: '某科技并购项目',
    projectId: 'PRJ001',
    applicant: {
      id: 'U001',
      name: '张明',
      department: '投资并购部',
      avatar: 'https://picsum.photos/id/64/100/100'
    },
    purpose: '项目尽调分析，需要查阅目标公司财务数据和合同资料',
    validFrom: '2026-06-22',
    validTo: '2026-06-30',
    applyTime: '2026-06-22 09:30',
    status: 'pending',
    summary: '本报告包含目标公司近三年财务数据、核心业务合同、知识产权清单等敏感信息。文件已脱敏处理，关键数据以马赛克方式遮挡。',
    directory: directoryData,
    screenshots: screenshotUrls
  },
  {
    id: 'AP002',
    fileName: '2026年度Q2财务分析报表.xlsx',
    fileType: 'Excel',
    fileSize: '5.8MB',
    level: 'confidential',
    projectName: '财务季度报告',
    projectId: 'PRJ002',
    applicant: {
      id: 'U002',
      name: '李华',
      department: '财务部',
      avatar: 'https://picsum.photos/id/91/100/100'
    },
    purpose: '制作经营分析报告，需要查阅各事业部详细财务数据',
    validFrom: '2026-06-22',
    validTo: '2026-06-25',
    applyTime: '2026-06-22 10:15',
    status: 'pending',
    summary: '包含公司各事业部Q2营收、成本、利润等核心财务数据。已按脱敏规则处理，具体金额以区间方式展示。',
    directory: [
      { name: '营收分析表.xlsx', type: 'file' },
      { name: '成本分析表.xlsx', type: 'file' },
      { name: '利润分析表.xlsx', type: 'file' }
    ],
    screenshots: [screenshotUrls[0], screenshotUrls[1]]
  },
  {
    id: 'AP003',
    fileName: '智能工厂建设项目技术方案.docx',
    fileType: 'Word',
    fileSize: '8.2MB',
    level: 'secret',
    projectName: '智能工厂建设',
    projectId: 'PRJ003',
    applicant: {
      id: 'U003',
      name: '王强',
      department: '智能制造部',
      avatar: 'https://picsum.photos/id/177/100/100'
    },
    purpose: '项目评审准备，需要了解技术方案细节以准备评审材料',
    validFrom: '2026-06-22',
    validTo: '2026-07-15',
    applyTime: '2026-06-21 16:45',
    status: 'pending',
    summary: '包含智能工厂整体架构、核心技术指标、设备选型方案等内容。已对核心技术参数进行脱敏处理。',
    directory: [
      {
        name: '技术方案',
        type: 'folder',
        children: [
          { name: '总体架构.docx', type: 'file' },
          { name: '系统设计.docx', type: 'file' }
        ]
      },
      { name: '设备清单.xlsx', type: 'file' }
    ],
    screenshots: [screenshotUrls[2]]
  },
  {
    id: 'AP004',
    fileName: '战略合作框架协议（草案）.pdf',
    fileType: 'PDF',
    fileSize: '2.1MB',
    level: 'confidential',
    projectName: '某科技并购项目',
    projectId: 'PRJ001',
    applicant: {
      id: 'U004',
      name: '赵雪',
      department: '法务部',
      avatar: 'https://picsum.photos/id/338/100/100'
    },
    purpose: '合同审核，需要对合作协议条款进行法律审查',
    validFrom: '2026-06-22',
    validTo: '2026-06-28',
    applyTime: '2026-06-21 14:20',
    status: 'pending',
    summary: '战略合作框架协议草案，涉及双方合作模式、权益分配、保密条款等核心内容。商业条款已部分脱敏。',
    directory: [
      { name: '合作协议.pdf', type: 'file' },
      { name: '附件一.pdf', type: 'file' },
      { name: '附件二.pdf', type: 'file' }
    ],
    screenshots: screenshotUrls
  },
  {
    id: 'AP005',
    fileName: '核心算法模型技术文档.pdf',
    fileType: 'PDF',
    fileSize: '15.6MB',
    level: 'top-secret',
    projectName: 'AI算法研发',
    projectId: 'PRJ004',
    applicant: {
      id: 'U005',
      name: '陈宇',
      department: 'AI研发部',
      avatar: 'https://picsum.photos/id/1027/100/100'
    },
    purpose: '技术方案研讨，需要查阅算法细节以进行方案优化讨论',
    validFrom: '2026-06-22',
    validTo: '2026-06-23',
    applyTime: '2026-06-22 08:50',
    status: 'pending',
    summary: '包含核心算法架构、训练数据特征、模型参数等技术机密。核心参数已加密处理，仅供架构评审参考。',
    directory: [
      {
        name: '算法文档',
        type: 'folder',
        children: [
          { name: '模型架构.pdf', type: 'file' },
          { name: '训练方案.pdf', type: 'file' }
        ]
      },
      { name: '性能测试报告.pdf', type: 'file' }
    ],
    screenshots: screenshotUrls
  }
];

export const decisionHistory: ApprovalItem[] = [
  {
    id: 'AP006',
    fileName: '年度预算调整方案.pdf',
    fileType: 'PDF',
    fileSize: '3.2MB',
    level: 'confidential',
    projectName: '年度预算',
    projectId: 'PRJ005',
    applicant: {
      id: 'U006',
      name: '孙丽',
      department: '财务部',
      avatar: 'https://picsum.photos/id/64/100/100'
    },
    purpose: '预算调整审核，需确认各部门预算调整合理性',
    validFrom: '2026-06-15',
    validTo: '2026-06-20',
    applyTime: '2026-06-15 10:00',
    status: 'approved',
    decision: 'approve',
    decisionReason: '预算调整合理，同意执行',
    decisionTime: '2026-06-15 15:30',
    summary: '年度预算调整方案，包含各部门预算增减明细。',
    directory: [{ name: '预算方案.pdf', type: 'file' }],
    screenshots: [screenshotUrls[0]]
  },
  {
    id: 'AP007',
    fileName: '客户名单及联系方式.xlsx',
    fileType: 'Excel',
    fileSize: '1.5MB',
    level: 'secret',
    projectName: '客户关系管理',
    projectId: 'PRJ006',
    applicant: {
      id: 'U007',
      name: '周涛',
      department: '销售部',
      avatar: 'https://picsum.photos/id/91/100/100'
    },
    purpose: '客户拜访准备，需要获取客户详细联系方式',
    validFrom: '2026-06-10',
    validTo: '2026-06-12',
    applyTime: '2026-06-10 09:00',
    status: 'time-limited',
    decision: 'time-limited',
    decisionReason: '限时3天，仅供本次拜访使用',
    decisionTime: '2026-06-10 11:20',
    summary: '包含VIP客户名单及联系方式，仅限内部使用。',
    directory: [{ name: '客户名单.xlsx', type: 'file' }],
    screenshots: [screenshotUrls[1]]
  },
  {
    id: 'AP008',
    fileName: '新产品设计图纸.zip',
    fileType: '压缩包',
    fileSize: '25.8MB',
    level: 'confidential',
    projectName: '新产品研发',
    projectId: 'PRJ007',
    applicant: {
      id: 'U008',
      name: '吴刚',
      department: '研发部',
      avatar: 'https://picsum.photos/id/177/100/100'
    },
    purpose: '设计评审，需要查看新产品设计图纸细节',
    validFrom: '2026-06-08',
    validTo: '2026-06-15',
    applyTime: '2026-06-08 14:30',
    status: 'online-only',
    decision: 'online-only',
    decisionReason: '仅允许在线查看，禁止下载和转发',
    decisionTime: '2026-06-08 16:45',
    summary: '新产品全套设计图纸，包含结构设计、电气设计等。',
    directory: [
      {
        name: '设计图纸',
        type: 'folder',
        children: [
          { name: '结构图.dwg', type: 'file' },
          { name: '电气图.dwg', type: 'file' }
        ]
      }
    ],
    screenshots: screenshotUrls
  },
  {
    id: 'AP009',
    fileName: '员工薪酬调整方案.pdf',
    fileType: 'PDF',
    fileSize: '2.8MB',
    level: 'confidential',
    projectName: '人力资源',
    projectId: 'PRJ008',
    applicant: {
      id: 'U009',
      name: '郑雯',
      department: '人力资源部',
      avatar: 'https://picsum.photos/id/338/100/100'
    },
    purpose: '薪酬方案制定，需要参考历史调薪数据',
    validFrom: '2026-06-05',
    validTo: '2026-06-10',
    applyTime: '2026-06-05 10:30',
    status: 'rejected',
    decision: 'reject',
    decisionReason: '数据敏感，建议由部门总监直接对接',
    decisionTime: '2026-06-05 14:00',
    summary: '员工薪酬调整方案及历史数据。',
    directory: [{ name: '薪酬方案.pdf', type: 'file' }],
    screenshots: [screenshotUrls[2]]
  },
  {
    id: 'AP010',
    fileName: '并购项目尽职调查报告V2.pdf',
    fileType: 'PDF',
    fileSize: '18.3MB',
    level: 'top-secret',
    projectName: '某科技并购项目',
    projectId: 'PRJ001',
    applicant: {
      id: 'U010',
      name: '黄伟',
      department: '投资并购部',
      avatar: 'https://picsum.photos/id/1027/100/100'
    },
    purpose: '项目决策参考，需要查阅最新尽调数据',
    validFrom: '2026-06-01',
    validTo: '2026-06-30',
    applyTime: '2026-06-01 08:30',
    status: 'approved',
    decision: 'approve',
    decisionReason: '项目关键节点，同意查阅',
    decisionTime: '2026-06-01 10:00',
    summary: '最新版尽职调查报告，包含财务、法律、业务等全方位尽调结果。',
    directory: directoryData,
    screenshots: screenshotUrls
  }
];

export const currentUser = {
  id: 'ADMIN001',
  name: '王总',
  title: '副总裁',
  department: '管理层',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  email: 'wangzong@company.com'
};

export const approverList: ApproverInfo[] = [
  {
    id: 'ADMIN001',
    name: '王总',
    title: '副总裁',
    department: '管理层',
    avatar: 'https://picsum.photos/id/64/100/100',
    phone: '138****8888'
  },
  {
    id: 'ADMIN002',
    name: '李总',
    title: '首席财务官',
    department: '财务部',
    avatar: 'https://picsum.photos/id/91/100/100',
    phone: '139****6666'
  },
  {
    id: 'ADMIN003',
    name: '张总',
    title: '首席技术官',
    department: '技术部',
    avatar: 'https://picsum.photos/id/177/100/100',
    phone: '137****9999'
  },
  {
    id: 'ADMIN004',
    name: '刘总',
    title: '首席运营官',
    department: '运营部',
    avatar: 'https://picsum.photos/id/338/100/100',
    phone: '136****7777'
  },
  {
    id: 'ADMIN005',
    name: '陈总',
    title: '法务总监',
    department: '法务部',
    avatar: 'https://picsum.photos/id/1027/100/100',
    phone: '135****5555'
  }
];

export const myProjects = ['PRJ001', 'PRJ004', 'PRJ006'];

export const notificationList: NotificationItem[] = [
  {
    id: 'NOT001',
    type: 'approval-result',
    title: '审批结果通知',
    fileName: '年度预算调整方案.pdf',
    fileId: 'FILE006',
    approvalId: 'AP006',
    decision: 'approve',
    decisionReason: '预算调整合理，同意执行',
    decisionTime: '2026-06-15 15:30',
    fromUser: '王总',
    toUserId: 'U006',
    status: 'notified',
    createTime: '2026-06-15 15:30',
    projectName: '年度预算',
    level: 'confidential'
  },
  {
    id: 'NOT002',
    type: 'approval-result',
    title: '审批结果通知',
    fileName: '客户名单及联系方式.xlsx',
    fileId: 'FILE007',
    approvalId: 'AP007',
    decision: 'time-limited',
    decisionReason: '限时3天，仅供本次拜访使用',
    decisionTime: '2026-06-10 11:20',
    deadline: '2026-06-13',
    fromUser: '王总',
    toUserId: 'U007',
    status: 'notified',
    createTime: '2026-06-10 11:20',
    projectName: '客户关系管理',
    level: 'secret'
  }
];

pendingApprovals.forEach((item, index) => {
  if (myProjects.includes(item.projectId)) {
    item.projectOwnership = 'mine';
  } else if (index % 2 === 0) {
    item.projectOwnership = 'transfer';
  } else {
    item.projectOwnership = 'neutral';
  }
});

decisionHistory.forEach((item) => {
  item.notificationStatus = 'notified';
  if (item.decision === 'time-limited' && !item.deadline) {
    item.deadline = '2026-06-13';
  }
});

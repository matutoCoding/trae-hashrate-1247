import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Button
} from '@tarojs/components';
import { useRouter, useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApprovalStore } from '@/store/approval';
import LevelTag from '@/components/LevelTag';
import ApprovalModal from '@/components/ApprovalModal';
import { DecisionType, DirectoryNode } from '@/types/approval';

const statusTextMap: Record<string, string> = {
  approved: '已同意',
  rejected: '已驳回',
  'time-limited': '限时同意',
  'online-only': '仅在线查看'
};

const statusIconMap: Record<string, string> = {
  approved: '✓',
  rejected: '✕',
  'time-limited': '⏰',
  'online-only': '👁'
};

const DirectoryTree: React.FC<{ nodes: DirectoryNode[] }> = ({ nodes }) => {
  return (
    <View className={styles.directoryTree}>
      {nodes.map((node, index) => (
        <View key={index} className={styles.treeNode}>
          <View className={styles.nodeContent}>
            <Text className={styles.nodeIcon}>
              {node.type === 'folder' ? '📁' : '📄'}
            </Text>
            <Text className={styles.nodeName}>{node.name}</Text>
          </View>
          {node.children && node.children.length > 0 && (
            <View className={styles.treeChildren}>
              <DirectoryTree nodes={node.children} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const PreviewPage: React.FC = () => {
  const router = useRouter();
  const { getApprovalById, makeDecision } = useApprovalStore();

  const [modalVisible, setModalVisible] = useState(false);

  const approvalId = router.params.id || '';
  const approval = getApprovalById(approvalId);

  const isPending = approval?.status === 'pending';

  const fileTypeIcon = useMemo(() => {
    if (!approval) return '📄';
    const type = approval.fileType.toLowerCase();
    if (type.includes('pdf')) return '📕';
    if (type.includes('doc') || type.includes('word')) return '📘';
    if (type.includes('xls') || type.includes('excel')) return '📗';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  }, [approval]);

  const handleApproveClick = () => {
    setModalVisible(true);
  };

  const handleRejectClick = () => {
    setModalVisible(true);
  };

  const handleConfirm = (decision: DecisionType, reason: string) => {
    if (!approval) return;

    makeDecision(approval.id, decision, reason);
    setModalVisible(false);

    Taro.showToast({
      title: '审批已提交',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);

    console.log('[PreviewPage] 提交审批', { id: approval.id, decision, reason });
  };

  useDidShow(() => {
    console.log('[PreviewPage] 页面显示，审批ID:', approvalId);
  });

  if (!approval) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx 32rpx', textAlign: 'center' }}>
          <Text style={{ color: '#86909C' }}>未找到该审批记录</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        <View className={styles.fileInfoCard}>
          <View className={styles.fileHeader}>
            <View className={styles.fileIcon}>
              <Text className={styles.iconText}>{fileTypeIcon}</Text>
            </View>
            <View className={styles.fileTitle}>
              <Text className={styles.fileName}>{approval.fileName}</Text>
              <View className={styles.fileMeta}>
                <LevelTag level={approval.level} size="small" />
                <View className={styles.metaItem}>
                  <Text>{approval.fileType}</Text>
                  <Text className={styles.dot}>·</Text>
                  <Text>{approval.fileSize}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {!isPending && approval.decision && (
          <View className={styles.decisionResult}>
            <View className={styles.resultHeader}>
              <View className={`${styles.resultIcon} ${styles[approval.status]}`}>
                <Text>{statusIconMap[approval.status] || '✓'}</Text>
              </View>
              <View className={styles.resultInfo}>
                <Text className={styles.resultStatus}>
                  {statusTextMap[approval.status] || approval.status}
                </Text>
                <Text className={styles.resultTime}>
                  审批时间：{approval.decisionTime}
                </Text>
              </View>
            </View>
            {approval.decisionReason && (
              <View className={styles.resultReason}>
                <Text className={styles.reasonLabel}>审批理由</Text>
                <Text className={styles.reasonText}>{approval.decisionReason}</Text>
              </View>
            )}
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            脱敏摘要
          </Text>
          <View className={styles.summaryCard}>
            <View className={styles.summaryHeader}>
              <Text className={styles.summaryIcon}>⚠️</Text>
              <Text className={styles.summaryLabel}>已脱敏处理，关键信息已隐藏</Text>
            </View>
            <Text className={styles.summaryText}>{approval.summary}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📂</Text>
            目录结构
          </Text>
          {approval.directory && approval.directory.length > 0 ? (
            <DirectoryTree nodes={approval.directory} />
          ) : (
            <Text style={{ color: '#86909C', fontSize: '24rpx' }}>暂无目录信息</Text>
          )}
        </View>

        <View className={`${styles.section} ${styles.screenshotSection}`}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🖼</Text>
            关键页截图
            <Text style={{ fontSize: '22rpx', color: '#86909C', fontWeight: 'normal', marginLeft: '8rpx' }}>
              （仅展示摘要，不提供原件下载）
            </Text>
          </Text>
          <ScrollView scrollX className={styles.screenshotsScroll}>
            <View className={styles.screenshotList}>
              {approval.screenshots && approval.screenshots.length > 0 ? (
                approval.screenshots.map((src, index) => (
                  <View key={index} className={styles.screenshotItem}>
                    <Image
                      className={styles.screenshotImg}
                      src={src}
                      mode="aspectFill"
                      onClick={() => {
                        Taro.previewImage({
                          urls: approval.screenshots || [],
                          current: src
                        });
                      }}
                    />
                  </View>
                ))
              ) : (
                <Text style={{ color: '#86909C', fontSize: '24rpx' }}>暂无截图</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>👤</Text>
            申请人
          </Text>
          <View className={styles.applicantCard}>
            <Image
              className={styles.applicantAvatar}
              src={approval.applicant.avatar}
              mode="aspectFill"
            />
            <View className={styles.applicantInfo}>
              <Text className={styles.applicantName}>{approval.applicant.name}</Text>
              <Text className={styles.applicantDept}>{approval.applicant.department}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            申请详情
          </Text>
          <View className={styles.infoList}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>所属项目</Text>
              <Text className={styles.infoValue}>{approval.projectName}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>用途说明</Text>
              <Text className={styles.infoValue}>{approval.purpose}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>申请时间</Text>
              <Text className={styles.infoValue}>{approval.applyTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>有效期</Text>
              <Text className={styles.infoValue}>
                {approval.validFrom} 至 {approval.validTo}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {isPending && (
        <View className={styles.bottomBar}>
          <Button className={styles.rejectBtn} onClick={handleRejectClick}>
            驳回
          </Button>
          <Button className={styles.approveBtn} onClick={handleApproveClick}>
            同意审批
          </Button>
        </View>
      )}

      <ApprovalModal
        visible={modalVisible}
        fileName={approval.fileName}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </ScrollView>
  );
};

export default PreviewPage;

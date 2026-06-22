import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApprovalStore } from '@/store/approval';
import ApprovalCard from '@/components/ApprovalCard';
import TransferModal from '@/components/TransferModal';
import { ApprovalLevel, ApprovalItem, ProjectOwnership } from '@/types/approval';

interface ProjectFilter {
  id: string;
  name: string;
}

interface LevelFilter {
  value: ApprovalLevel | 'all';
  label: string;
}

interface OwnershipFilter {
  value: ProjectOwnership | 'all';
  label: string;
}

const PendingPage: React.FC = () => {
  const {
    pendingList,
    selectedProject,
    selectedLevel,
    setSelectedProject,
    setSelectedLevel,
    getFilteredPendingList,
    initStore,
    checkAndUpdateExpiredItems,
    isInitialized
  } = useApprovalStore();

  const [selectedOwnership, setSelectedOwnership] = useState<ProjectOwnership | 'all'>('all');
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferItem, setTransferItem] = useState<ApprovalItem | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      initStore();
    }
  }, [isInitialized, initStore]);

  const filteredList = useMemo(() => {
    let list = getFilteredPendingList();
    if (selectedOwnership !== 'all') {
      list = list.filter(item => item.projectOwnership === selectedOwnership);
    }
    return list;
  }, [getFilteredPendingList, selectedOwnership]);

  const projectList: ProjectFilter[] = useMemo(() => {
    const projectMap = new Map<string, string>();
    pendingList.forEach((item) => {
      if (!projectMap.has(item.projectId)) {
        projectMap.set(item.projectId, item.projectName);
      }
    });
    return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
  }, [pendingList]);

  const levelFilters: LevelFilter[] = [
    { value: 'all', label: '全部' },
    { value: 'top-secret', label: '绝密' },
    { value: 'confidential', label: '机密' },
    { value: 'secret', label: '秘密' }
  ];

  const ownershipFilters: OwnershipFilter[] = [
    { value: 'all', label: '全部' },
    { value: 'mine', label: '我负责' },
    { value: 'transfer', label: '需转交' }
  ];

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  const handleLevelClick = (level: ApprovalLevel | 'all') => {
    if (level === 'all') {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(selectedLevel === level ? null : level);
    }
  };

  const handleOwnershipClick = (ownership: ProjectOwnership | 'all') => {
    setSelectedOwnership(selectedOwnership === ownership ? 'all' : ownership);
  };

  const handleTransfer = (item: ApprovalItem) => {
    setTransferItem(item);
    setTransferModalVisible(true);
  };

  const handleTransferSuccess = () => {
    Taro.showToast({
      title: '转交成功',
      icon: 'success',
      duration: 1500
    });
  };

  usePullDownRefresh(() => {
    checkAndUpdateExpiredItems();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  useDidShow(() => {
    if (isInitialized) {
      checkAndUpdateExpiredItems();
    }
    console.log('[PendingPage] 页面显示，待审批数量:', pendingList.length);
  });

  if (!isInitialized) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx 32rpx', textAlign: 'center' }}>
          <Text style={{ color: '#86909C' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTitle}>
          待审批
          <View className={styles.countBadge}>{pendingList.length} 项</View>
        </View>
        <Text className={styles.headerSubtitle}>快速处理敏感文件访问申请</Text>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterCard}>
          <Text className={styles.filterTitle}>按归属筛选</Text>
          <View className={styles.filterTags}>
            {ownershipFilters.map((filter) => (
              <View
                key={filter.value}
                className={classnames(
                  styles.filterTag,
                  selectedOwnership === filter.value && styles.active
                )}
                onClick={() => handleOwnershipClick(filter.value)}
              >
                {filter.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.filterCard}>
          <Text className={styles.filterTitle}>按项目筛选</Text>
          <View className={styles.filterTags}>
            {projectList.map((project) => (
              <View
                key={project.id}
                className={classnames(
                  styles.filterTag,
                  selectedProject === project.id && styles.active
                )}
                onClick={() => handleProjectClick(project.id)}
              >
                {project.name}
              </View>
            ))}
            {projectList.length === 0 && (
              <Text className={styles.filterTag}>暂无项目</Text>
            )}
          </View>
        </View>

        <View className={styles.filterCard}>
          <Text className={styles.filterTitle}>按密级筛选</Text>
          <View className={styles.filterTags}>
            {levelFilters.map((level) => (
              <View
                key={level.value}
                className={classnames(
                  styles.filterTag,
                  (level.value === 'all' ? !selectedLevel : selectedLevel === level.value) && styles.active
                )}
                onClick={() => handleLevelClick(level.value)}
              >
                {level.label}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.listSection}>
        <View className={styles.listHeader}>
          <Text className={styles.listTitle}>申请列表</Text>
          <Text className={styles.listCount}>共 {filteredList.length} 条</Text>
        </View>

        {filteredList.length > 0 ? (
          <View>
            {filteredList.map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onTransfer={handleTransfer}
              />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>
              <Text className={styles.iconText}>✓</Text>
            </View>
            <Text className={styles.emptyText}>暂无待审批申请</Text>
          </View>
        )}
      </View>

      {transferItem && (
        <TransferModal
          visible={transferModalVisible}
          fileName={transferItem.fileName}
          approvalId={transferItem.id}
          onClose={() => setTransferModalVisible(false)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </ScrollView>
  );
};

export default PendingPage;

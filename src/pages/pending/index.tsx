import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApprovalStore } from '@/store/approval';
import ApprovalCard from '@/components/ApprovalCard';
import { ApprovalLevel } from '@/types/approval';

interface ProjectFilter {
  id: string;
  name: string;
}

interface LevelFilter {
  value: ApprovalLevel | 'all';
  label: string;
}

const PendingPage: React.FC = () => {
  const {
    pendingList,
    selectedProject,
    selectedLevel,
    setSelectedProject,
    setSelectedLevel,
    getFilteredPendingList
  } = useApprovalStore();

  const filteredList = getFilteredPendingList();

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

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  useDidShow(() => {
    console.log('[PendingPage] 页面显示，待审批数量:', pendingList.length);
  });

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
              <ApprovalCard key={item.id} item={item} />
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
    </ScrollView>
  );
};

export default PendingPage;

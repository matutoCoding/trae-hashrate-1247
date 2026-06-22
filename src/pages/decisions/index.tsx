import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApprovalStore } from '@/store/approval';
import DecisionCard from '@/components/DecisionCard';
import { ApprovalStatus, ProjectGroup } from '@/types/approval';

type FilterStatus = 'all' | ApprovalStatus;

interface StatusFilter {
  value: FilterStatus;
  label: string;
}

const DecisionsPage: React.FC = () => {
  const { historyList, getProjectGroups, initStore, checkAndUpdateExpiredItems } = useApprovalStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    initStore();
  }, [initStore]);

  const statusFilters: StatusFilter[] = [
    { value: 'all', label: '全部' },
    { value: 'approved', label: '已同意' },
    { value: 'time-limited', label: '限时同意' },
    { value: 'online-only', label: '仅在线' },
    { value: 'rejected', label: '已驳回' },
    { value: 'expired', label: '已过期' },
    { value: 'transferred', label: '已转交' }
  ];

  const filteredList = useMemo(() => {
    if (filterStatus === 'all') {
      return historyList;
    }
    return historyList.filter((item) => item.status === filterStatus);
  }, [historyList, filterStatus]);

  const projectGroups: ProjectGroup[] = useMemo(() => {
    return getProjectGroups(filteredList);
  }, [filteredList, getProjectGroups]);

  const stats = useMemo(() => {
    const total = historyList.length;
    const approved = historyList.filter((i) => i.status === 'approved').length;
    const rejected = historyList.filter((i) => i.status === 'rejected').length;
    const timeLimited = historyList.filter((i) => i.status === 'time-limited').length;
    const expired = historyList.filter((i) => i.status === 'expired').length;
    const transferred = historyList.filter((i) => i.status === 'transferred').length;
    return { total, approved, rejected, timeLimited, expired, transferred };
  }, [historyList]);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  usePullDownRefresh(() => {
    checkAndUpdateExpiredItems();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  useDidShow(() => {
    checkAndUpdateExpiredItems();
    if (projectGroups.length > 0 && expandedProjects.size === 0) {
      setExpandedProjects(new Set([projectGroups[0].projectId]));
    }
  });

  const getProjectInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>我的决策</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.total}</Text>
            <Text className={styles.statLabel}>总计</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.approved}</Text>
            <Text className={styles.statLabel}>已同意</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.timeLimited}</Text>
            <Text className={styles.statLabel}>限时</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.rejected}</Text>
            <Text className={styles.statLabel}>已驳回</Text>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={classnames(styles.statNumber, styles.expired)}>{stats.expired}</Text>
            <Text className={styles.statLabel}>已过期</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={classnames(styles.statNumber, styles.transferred)}>{stats.transferred}</Text>
            <Text className={styles.statLabel}>已转交</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterCard}>
          <View className={styles.filterTags}>
            {statusFilters.map((filter) => (
              <View
                key={filter.value}
                className={classnames(
                  styles.filterTag,
                  filterStatus === filter.value && styles.active
                )}
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.listSection}>
        {projectGroups.length > 0 ? (
          <View>
            {projectGroups.map((group) => (
              <View key={group.projectId} className={styles.projectGroup}>
                <View
                  className={styles.projectHeader}
                  onClick={() => toggleProject(group.projectId)}
                >
                  <View className={styles.projectTitle}>
                    <View className={styles.projectIcon}>
                      <Text className={styles.iconText}>
                        {getProjectInitial(group.projectName)}
                      </Text>
                    </View>
                    <Text className={styles.projectName}>{group.projectName}</Text>
                    <Text className={styles.projectCount}>{group.count} 条</Text>
                  </View>
                  <Text
                    className={classnames(
                      styles.arrowIcon,
                      expandedProjects.has(group.projectId) && styles.expanded
                    )}
                  >
                    ▼
                  </Text>
                </View>
                {expandedProjects.has(group.projectId) && (
                  <View className={styles.projectContent}>
                    {group.items.map((item) => (
                      <DecisionCard key={item.id} item={item} />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>
              <Text className={styles.iconText}>📋</Text>
            </View>
            <Text className={styles.emptyText}>暂无决策记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DecisionsPage;

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useApprovalStore } from '@/store/approval';
import LevelTag from '@/components/LevelTag';
import { NotificationItem, DecisionType, NotificationType } from '@/types/approval';

const decisionTextMap: Record<DecisionType, string> = {
  'approve': '已同意',
  'reject': '已驳回',
  'time-limited': '限时同意',
  'online-only': '仅在线查看'
};

const typeIconMap: Record<NotificationType, string> = {
  'approval-result': '📋',
  'transfer': '↗',
  'system': '🔔'
};

const NotificationsPage: React.FC = () => {
  const {
    notificationList,
    initStore,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadNotificationCount
  } = useApprovalStore();

  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    initStore();
  }, [initStore]);

  const filteredList = useMemo(() => {
    if (selectedType === 'all') {
      return [...notificationList].sort((a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
    }
    return [...notificationList]
      .filter(n => n.type === selectedType)
      .sort((a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
  }, [notificationList, selectedType]);

  const unreadCount = useMemo(() => {
    return getUnreadNotificationCount();
  }, [notificationList, getUnreadNotificationCount]);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.status === 'unread') {
      markNotificationRead(notification.id);
    }

    Taro.navigateTo({
      url: `/pages/preview/index?id=${notification.approvalId}`
    });
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    Taro.showModal({
      title: '提示',
      content: '确定将所有消息标记为已读吗？',
      success: (res) => {
        if (res.confirm) {
          markAllNotificationsRead();
          Taro.showToast({
            title: '已全部标记为已读',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  };

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  useDidShow(() => {
    console.log('[NotificationsPage] page show, count:', notificationList.length);
  });

  const typeFilters: { value: NotificationType | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'approval-result', label: '审批结果' },
    { value: 'transfer', label: '转交通知' },
    { value: 'system', label: '系统通知' }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <Text className={styles.headerTitle}>消息通知</Text>
          {unreadCount > 0 && (
            <View className={styles.markAllBtn} onClick={handleMarkAllRead}>
              <Text className={styles.markAllText}>全部已读</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Text className={styles.headerSubtitle}>您有 {unreadCount} 条未读消息</Text>
        )}
      </View>

      <View className={styles.filterSection}>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterTags}>
            {typeFilters.map((filter) => (
              <View
                key={filter.value}
                className={classnames(
                  styles.filterTag,
                  selectedType === filter.value && styles.active
                )}
                onClick={() => setSelectedType(filter.value)}
              >
                {filter.label}
                {filter.value === 'all' && unreadCount > 0 && (
                  <View className={styles.filterBadge}>{unreadCount}</View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredList.length > 0 ? (
          <View>
            {filteredList.map((notification) => (
              <View
                key={notification.id}
                className={classnames(
                  styles.notificationCard,
                  notification.status === 'unread' && styles.unread
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.status === 'unread' && (
                  <View className={styles.unreadDot} />
                )}
                <View className={styles.cardHeader}>
                  <View className={styles.iconBox}>
                    <Text className={styles.iconText}>
                      {typeIconMap[notification.type] || '📋'}
                    </Text>
                  </View>
                  <View className={styles.headerInfo}>
                    <Text className={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text className={styles.notificationTime}>
                      {notification.createTime}
                    </Text>
                  </View>
                  {notification.level && (
                    <LevelTag level={notification.level} size="small" />
                  )}
                </View>

                <View className={styles.cardBody}>
                  <Text className={styles.fileName}>{notification.fileName}</Text>
                  {notification.projectName && (
                    <View className={styles.projectTag}>
                      <Text className={styles.projectTagText}>
                        项目：{notification.projectName}
                      </Text>
                    </View>
                  )}
                </View>

                {notification.decision && (
                  <View className={styles.decisionInfo}>
                    <Text className={styles.decisionLabel}>审批结论</Text>
                    <Text className={classnames(
                      styles.decisionValue,
                      styles[notification.decision]
                    )}>
                      {decisionTextMap[notification.decision]}
                    </Text>
                  </View>
                )}

                {notification.deadline && (
                  <View className={styles.deadlineInfo}>
                    <Text className={styles.deadlineLabel}>截止时间</Text>
                    <Text className={styles.deadlineValue}>{notification.deadline}</Text>
                  </View>
                )}

                {notification.decisionReason && (
                  <View className={styles.reasonBox}>
                    <Text className={styles.reasonLabel}>审批理由</Text>
                    <Text className={styles.reasonText}>{notification.decisionReason}</Text>
                  </View>
                )}

                <View className={styles.cardFooter}>
                  <Text className={styles.footerText}>
                    来自：{notification.fromUser}
                  </Text>
                  <View className={styles.viewDetail}>
                    <Text className={styles.viewDetailText}>查看详情</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>
              <Text className={styles.iconText}>📭</Text>
            </View>
            <Text className={styles.emptyText}>暂无消息通知</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationsPage;

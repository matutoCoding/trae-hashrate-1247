import React, { useMemo, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { currentUser } from '@/data/mockData';
import { useApprovalStore } from '@/store/approval';

interface MenuItem {
  icon: string;
  iconType: string;
  title: string;
  desc?: string;
  badge?: number;
  onClick?: () => void;
}

const MinePage: React.FC = () => {
  const { pendingList, initStore, getUnreadNotificationCount, notificationList } = useApprovalStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  const unreadCount = useMemo(() => {
    return getUnreadNotificationCount();
  }, [notificationList, getUnreadNotificationCount]);

  const handleMenuClick = (title: string) => {
    Taro.showToast({
      title: `${title}功能开发中`,
      icon: 'none'
    });
  };

  const businessMenus: MenuItem[] = [
    {
      icon: '📋',
      iconType: 'primary',
      title: '待审批',
      desc: `共 ${pendingList.length} 条待处理`,
      onClick: () => {
        Taro.switchTab({ url: '/pages/pending/index' });
      }
    },
    {
      icon: '📊',
      iconType: 'success',
      title: '审批统计',
      desc: '查看审批数据统计',
      onClick: () => handleMenuClick('审批统计')
    },
    {
      icon: '🔔',
      iconType: 'warning',
      title: '消息通知',
      desc: unreadCount > 0 ? `您有 ${unreadCount} 条未读消息` : '暂无未读消息',
      badge: unreadCount > 0 ? unreadCount : undefined,
      onClick: () => {
        Taro.navigateTo({ url: '/pages/notifications/index' });
      }
    }
  ];

  const settingMenus: MenuItem[] = [
    {
      icon: '🔒',
      iconType: 'primary',
      title: '安全设置',
      desc: '指纹/面容识别、手势密码',
      onClick: () => handleMenuClick('安全设置')
    },
    {
      icon: '❓',
      iconType: 'info',
      title: '帮助中心',
      desc: '常见问题、使用指南',
      onClick: () => handleMenuClick('帮助中心')
    },
    {
      icon: 'ℹ️',
      iconType: 'info',
      title: '关于我们',
      desc: '版本信息、隐私政策',
      onClick: () => handleMenuClick('关于我们')
    }
  ];

  useDidShow(() => {
    console.log('[MinePage] page show');
  });

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <Image
            className={styles.avatar}
            src={currentUser.avatar}
            mode="aspectFill"
          />
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>{currentUser.name}</Text>
            <Text className={styles.userTitle}>{currentUser.title}</Text>
            <Text className={styles.userDept}>{currentUser.department}</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuCard}>
          <Text className={styles.menuCardTitle}>业务中心</Text>
          {businessMenus.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={item.onClick}
            >
              <View className={`${styles.menuIcon} ${styles[item.iconType]}`}>
                <Text className={styles.iconText}>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                {item.desc && (
                  <Text className={styles.menuDesc}>{item.desc}</Text>
                )}
              </View>
              {item.badge && item.badge > 0 && (
                <View className={styles.badge}>{item.badge}</View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>

        <View className={styles.menuCard}>
          <Text className={styles.menuCardTitle}>设置与帮助</Text>
          {settingMenus.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={item.onClick}
            >
              <View className={`${styles.menuIcon} ${styles[item.iconType]}`}>
                <Text className={styles.iconText}>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                {item.desc && (
                  <Text className={styles.menuDesc}>{item.desc}</Text>
                )}
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>

        <View className={styles.footer}>
          <Text className={styles.footerText}>密级审批移动版</Text>
          <Text className={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;

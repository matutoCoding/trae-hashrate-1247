import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import LevelTag from '@/components/LevelTag';
import { ApprovalItem } from '@/types/approval';
import classnames from 'classnames';
import { dateUtils } from '@/utils/date';

interface DecisionCardProps {
  item: ApprovalItem;
  onClick?: () => void;
}

const statusTextMap: Record<string, string> = {
  approved: '已同意',
  rejected: '已驳回',
  'time-limited': '限时同意',
  'online-only': '仅在线查看',
  expired: '已过期',
  transferred: '已转交'
};

const DecisionCard: React.FC<DecisionCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/preview/index?id=${item.id}`
      });
    }
  };

  const isExpired = useMemo(() => {
    if (item.deadline && dateUtils.isExpired(item.deadline)) {
      return true;
    }
    return item.status === 'expired';
  }, [item.deadline, item.status]);

  const daysRemaining = useMemo(() => {
    if (item.deadline) {
      return dateUtils.getDaysRemaining(item.deadline);
    }
    return null;
  }, [item.deadline]);

  const displayStatus = isExpired ? 'expired' : item.status;
  const statusClass = displayStatus;

  return (
    <View className={classnames(styles.card, isExpired && styles.expiredCard)} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.leftInfo}>
          <LevelTag level={item.level} size="small" />
          <Text className={classnames(styles.statusTag, styles[statusClass])}>
            {statusTextMap[displayStatus]}
          </Text>
          {item.notificationStatus === 'notified' && (
            <Text className={styles.notifiedTag}>已通知</Text>
          )}
        </View>
        <Text className={styles.decisionTime}>{item.decisionTime}</Text>
      </View>

      <View className={styles.cardBody}>
        <Text className={styles.fileName}>{item.fileName}</Text>
        <View className={styles.applicantRow}>
          <Image
            className={styles.avatar}
            src={item.applicant.avatar}
            mode="aspectFill"
          />
          <Text className={styles.applicantText}>
            {item.applicant.department} · {item.applicant.name}
          </Text>
        </View>
      </View>

      {item.deadline && (
        <View className={styles.deadlineBox}>
          <Text className={styles.deadlineLabel}>
            {isExpired ? '过期时间' : '限时截止'}
          </Text>
          <Text className={classnames(styles.deadlineValue, isExpired && styles.expiredText)}>
            {item.deadline}
            {!isExpired && daysRemaining !== null && daysRemaining >= 0 && (
              <Text className={styles.daysRemaining}>（还剩{daysRemaining}天）</Text>
            )}
          </Text>
        </View>
      )}

      {item.transferRecord && (
        <View className={styles.transferBox}>
          <Text className={styles.transferLabel}>转交记录</Text>
          <Text className={styles.transferText}>
            {item.transferRecord.fromApproverName} → {item.transferRecord.toApproverName}
          </Text>
        </View>
      )}

      {item.decisionReason && (
        <View className={styles.reasonBox}>
          <Text className={styles.reasonLabel}>审批理由</Text>
          <Text className={styles.reasonText}>{item.decisionReason}</Text>
        </View>
      )}
    </View>
  );
};

export default DecisionCard;

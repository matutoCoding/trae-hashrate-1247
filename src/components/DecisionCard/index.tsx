import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import LevelTag from '@/components/LevelTag';
import { ApprovalItem } from '@/types/approval';
import classnames from 'classnames';

interface DecisionCardProps {
  item: ApprovalItem;
  onClick?: () => void;
}

const statusTextMap: Record<string, string> = {
  approved: '已同意',
  rejected: '已驳回',
  'time-limited': '限时同意',
  'online-only': '仅在线查看'
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

  const statusClass = item.status;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.leftInfo}>
          <LevelTag level={item.level} size="small" />
          <Text className={classnames(styles.statusTag, styles[statusClass])}>
            {statusTextMap[item.status]}
          </Text>
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

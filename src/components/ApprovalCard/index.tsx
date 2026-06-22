import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import LevelTag from '@/components/LevelTag';
import { ApprovalItem, ProjectOwnership } from '@/types/approval';
import classnames from 'classnames';

interface ApprovalCardProps {
  item: ApprovalItem;
  onClick?: () => void;
  onTransfer?: (item: ApprovalItem) => void;
}

const ownershipTextMap: Record<ProjectOwnership, string> = {
  mine: '我负责',
  transfer: '建议转交',
  neutral: ''
};

const ApprovalCard: React.FC<ApprovalCardProps> = ({ item, onClick, onTransfer }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/preview/index?id=${item.id}`
      });
    }
  };

  const handleTransferClick = (e: any) => {
    e.stopPropagation();
    if (onTransfer) {
      onTransfer(item);
    }
  };

  const ownership = item.projectOwnership || 'neutral';
  const showOwnership = ownership !== 'neutral';
  const showTransferBtn = ownership === 'transfer';

  return (
    <View className={classnames(styles.card, showOwnership && styles.hasOwnership)} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.applicantInfo}>
          <Image
            className={styles.avatar}
            src={item.applicant.avatar}
            mode="aspectFill"
          />
          <View className={styles.applicantDetail}>
            <Text className={styles.applicantName}>{item.applicant.name}</Text>
            <Text className={styles.department}>{item.applicant.department}</Text>
          </View>
        </View>
        <View className={styles.headerRight}>
          <LevelTag level={item.level} size="small" />
          {showOwnership && (
            <Text className={classnames(
              styles.ownershipTag,
              styles[ownership]
            )}>
              {ownershipTextMap[ownership]}
            </Text>
          )}
        </View>
      </View>

      <View className={styles.cardBody}>
        <Text className={styles.fileName}>{item.fileName}</Text>
        <View className={styles.projectTag}>
          <Text className={styles.projectTagText}>项目：{item.projectName}</Text>
        </View>
      </View>

      <View className={styles.cardInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>用途说明</Text>
          <Text className={styles.infoValue}>{item.purpose}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>有效期</Text>
          <Text className={styles.infoValue}>{item.validFrom} 至 {item.validTo}</Text>
        </View>
      </View>

      <View className={styles.cardFooter}>
        <Text className={styles.applyTime}>申请时间：{item.applyTime}</Text>
        <View className={styles.footerRight}>
          {showTransferBtn && (
            <View className={styles.transferBtn} onClick={handleTransferClick}>
              <Text className={styles.transferText}>一键转交</Text>
            </View>
          )}
          <View className={styles.viewDetail}>
            <Text className={styles.viewDetailText}>查看详情</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ApprovalCard;

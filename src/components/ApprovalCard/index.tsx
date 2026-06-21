import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import LevelTag from '@/components/LevelTag';
import { ApprovalItem } from '@/types/approval';

interface ApprovalCardProps {
  item: ApprovalItem;
  onClick?: () => void;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/preview/index?id=${item.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
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
        <View className={styles.viewDetail}>
          <Text className={styles.viewDetailText}>查看详情</Text>
        </View>
      </View>
    </View>
  );
};

export default ApprovalCard;

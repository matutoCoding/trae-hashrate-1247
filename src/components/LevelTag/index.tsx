import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ApprovalLevel } from '@/types/approval';

interface LevelTagProps {
  level: ApprovalLevel;
  size?: 'small' | 'medium';
}

const levelTextMap: Record<ApprovalLevel, string> = {
  'top-secret': '绝密',
  'confidential': '机密',
  'secret': '秘密'
};

const LevelTag: React.FC<LevelTagProps> = ({ level, size = 'medium' }) => {
  return (
    <View className={classnames(styles.levelTag, styles[level], styles[size])}>
      <Text className={styles.tagText}>{levelTextMap[level]}</Text>
    </View>
  );
};

export default LevelTag;

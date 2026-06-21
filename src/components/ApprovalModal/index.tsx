import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { DecisionType } from '@/types/approval';

interface ApprovalModalProps {
  visible: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: (decision: DecisionType, reason: string) => void;
}

interface DecisionOption {
  type: DecisionType;
  label: string;
  desc: string;
  typeClass: string;
}

const decisionOptions: DecisionOption[] = [
  {
    type: 'approve',
    label: '同意',
    desc: '允许下载和分享',
    typeClass: 'approve'
  },
  {
    type: 'time-limited',
    label: '限时同意',
    desc: '在有效期内可查看',
    typeClass: 'timeLimited'
  },
  {
    type: 'online-only',
    label: '仅在线查看',
    desc: '禁止下载和转发',
    typeClass: 'onlineOnly'
  },
  {
    type: 'reject',
    label: '驳回',
    desc: '拒绝该申请',
    typeClass: 'reject'
  }
];

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  visible,
  fileName,
  onClose,
  onConfirm
}) => {
  const [selectedType, setSelectedType] = useState<DecisionType | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedType(null);
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedType) {
      return;
    }
    if (!reason.trim()) {
      return;
    }
    onConfirm(selectedType, reason.trim());
    setSelectedType(null);
    setReason('');
  };

  const canSubmit = selectedType && reason.trim().length > 0;

  if (!visible) return null;

  return (
    <View className={styles.mask} onClick={handleClose}>
      <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <View className={styles.modalHeader}>
          <Text className={styles.modalTitle}>审批决策</Text>
          <View className={styles.closeBtn} onClick={handleClose}>
            <Text className={styles.closeText}>×</Text>
          </View>
        </View>

        <View className={styles.fileInfo}>
          <Text className={styles.fileName}>{fileName}</Text>
        </View>

        <View className={styles.optionsTitle}>
          <Text className={styles.optionsTitleText}>请选择决策类型</Text>
        </View>

        <View className={styles.optionsList}>
          {decisionOptions.map((option) => (
            <View
              key={option.type}
              className={classnames(
                styles.optionItem,
                selectedType === option.type && styles.optionActive,
                styles[option.typeClass]
              )}
              onClick={() => setSelectedType(option.type)}
            >
              <View className={styles.optionRadio}>
                {selectedType === option.type && (
                  <View className={styles.radioInner} />
                )}
              </View>
              <View className={styles.optionContent}>
                <Text className={styles.optionLabel}>{option.label}</Text>
                <Text className={styles.optionDesc}>{option.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.reasonSection}>
          <Text className={styles.reasonTitle}>审批理由<Text className={styles.required}>*</Text></Text>
          <Textarea
            className={styles.reasonInput}
            placeholder="请填写审批理由（必填）"
            value={reason}
            onInput={(e) => setReason(e.detail.value)}
            maxlength={200}
            autoHeight
          />
          <Text className={styles.reasonCount}>{reason.length}/200</Text>
        </View>

        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={handleClose}>
            取消
          </Button>
          <Button
            className={classnames(
              styles.confirmBtn,
              !canSubmit && styles.confirmDisabled
            )}
            disabled={!canSubmit}
            onClick={handleConfirm}
          >
            确认提交
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ApprovalModal;

import React, { useState, useMemo } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { DecisionType } from '@/types/approval';
import { dateUtils } from '@/utils/date';

interface ApprovalModalProps {
  visible: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: (decision: DecisionType, reason: string, deadline?: string) => void;
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
  const [selectedDeadline, setSelectedDeadline] = useState<string>('');

  const deadlineOptions = useMemo(() => {
    return dateUtils.generateDeadlineOptions();
  }, []);

  const handleClose = () => {
    setSelectedType(null);
    setReason('');
    setSelectedDeadline('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedType) {
      return;
    }
    if (!reason.trim()) {
      return;
    }
    if (selectedType === 'time-limited' && !selectedDeadline) {
      return;
    }
    onConfirm(
      selectedType,
      reason.trim(),
      selectedType === 'time-limited' ? selectedDeadline : undefined
    );
    setSelectedType(null);
    setReason('');
    setSelectedDeadline('');
  };

  const canSubmit = selectedType && reason.trim().length > 0 && 
    (selectedType !== 'time-limited' || selectedDeadline !== '');

  const handleDeadlineChange = (e: any) => {
    const index = e.detail.value;
    if (index >= 0 && index < deadlineOptions.length) {
      setSelectedDeadline(deadlineOptions[index].value);
    }
  };

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

        {selectedType === 'time-limited' && (
          <View className={styles.deadlineSection}>
            <Text className={styles.deadlineTitle}>截止时间<Text className={styles.required}>*</Text></Text>
            <Picker
              mode="selector"
              range={deadlineOptions.map(opt => opt.label)}
              value={deadlineOptions.findIndex(opt => opt.value === selectedDeadline)}
              onChange={handleDeadlineChange}
            >
              <View className={styles.deadlinePicker}>
                <Text className={selectedDeadline ? styles.deadlineValue : styles.deadlinePlaceholder}>
                  {selectedDeadline ? selectedDeadline : '请选择截止时间'}
                </Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </Picker>
            {selectedDeadline && (
              <Text className={styles.deadlineHint}>
                到期后权限将自动失效
              </Text>
            )}
          </View>
        )}

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

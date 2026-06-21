import React, { useState } from 'react';
import { View, Text, Image, Textarea, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ApproverInfo } from '@/types/approval';
import { useApprovalStore } from '@/store/approval';

interface TransferModalProps {
  visible: boolean;
  fileName: string;
  approvalId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  fileName,
  approvalId,
  onClose,
  onSuccess
}) => {
  const { getApproverList, transferApproval } = useApprovalStore();
  const [selectedApprover, setSelectedApprover] = useState<ApproverInfo | null>(null);
  const [reason, setReason] = useState('');

  const approverList = getApproverList();

  const handleClose = () => {
    setSelectedApprover(null);
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedApprover) return;
    if (!reason.trim()) return;

    transferApproval(
      approvalId,
      selectedApprover.id,
      selectedApprover.name,
      reason.trim()
    );

    setSelectedApprover(null);
    setReason('');
    onSuccess();
    onClose();
  };

  const canSubmit = selectedApprover && reason.trim().length > 0;

  if (!visible) return null;

  return (
    <View className={styles.mask} onClick={handleClose}>
      <View className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <View className={styles.modalHeader}>
          <Text className={styles.modalTitle}>转交审批</Text>
          <View className={styles.closeBtn} onClick={handleClose}>
            <Text className={styles.closeText}>×</Text>
          </View>
        </View>

        <View className={styles.fileInfo}>
          <Text className={styles.fileName}>{fileName}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择转交人<Text className={styles.required}>*</Text></Text>
          <View className={styles.approverList}>
            {approverList.map((approver) => (
              <View
                key={approver.id}
                className={classnames(
                  styles.approverItem,
                  selectedApprover?.id === approver.id && styles.selected
                )}
                onClick={() => setSelectedApprover(approver)}
              >
                <Image
                  className={styles.avatar}
                  src={approver.avatar}
                  mode="aspectFill"
                />
                <View className={styles.approverInfo}>
                  <Text className={styles.approverName}>{approver.name}</Text>
                  <Text className={styles.approverTitle}>{approver.title}</Text>
                  <Text className={styles.approverDept}>{approver.department}</Text>
                </View>
                <View className={styles.radio}>
                  {selectedApprover?.id === approver.id && (
                    <View className={styles.radioInner} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.reasonSection}>
          <Text className={styles.reasonTitle}>转交理由<Text className={styles.required}>*</Text></Text>
          <Textarea
            className={styles.reasonInput}
            placeholder="请填写转交理由（必填）"
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
            确认转交
          </Button>
        </View>
      </View>
    </View>
  );
};

export default TransferModal;

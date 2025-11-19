import React from 'react';
import styles from './CopyNotification.module.css';

interface CopyNotificationProps {
  show: boolean;
  status: 'success' | 'error';
  message?: string;
  topOffset?: number;
}

const CopyNotification: React.FC<CopyNotificationProps> = ({ 
  show, 
  status, 
  message,
  topOffset = -40 
}) => {
  if (!show) return null;

  const isSuccess = status === 'success';
  const defaultMessage = isSuccess ? '✓ 内容已复制到剪贴板' : '✗ 复制失败，请重试';

  // 创建动态类名来处理不同的topOffset值
  const offsetClass = `offset-${topOffset}`;
  
  return (
    <div 
      className={`${styles.notification} ${styles[status]} ${styles[offsetClass]}`}
    >
      {message || defaultMessage}
    </div>
  );
};

export default CopyNotification;
import React from 'react';

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

  return (
    <div 
      style={{
        position: 'absolute',
        top: `${topOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isSuccess ? '#f6ffed' : '#fff2f0',
        color: isSuccess ? '#52c41a' : '#ff4d4f',
        border: `1px solid ${isSuccess ? '#b7eb8f' : '#ffccc7'}`,
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '12px',
        zIndex: 1000,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {message || defaultMessage}
    </div>
  );
};

export default CopyNotification;
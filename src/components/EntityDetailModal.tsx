import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Button, Space, Typography, Tabs, Divider, message } from 'antd';
import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import type { Entity, EntityDetail, EntitySourceDetail } from '../types';
import { getEntityDetail, getEntitySources } from '../services/dataService';

const { Title, Paragraph, Text } = Typography;


interface EntityDetailModalProps {
  visible: boolean;
  entity: Entity | null;
  onClose: () => void;
}

const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ 
  visible, 
  entity, 
  onClose 
}) => {
  const [entityDetail, setEntityDetail] = useState<EntityDetail | null>(null);
  const [entitySources, setEntitySources] = useState<EntitySourceDetail[]>([]);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'success' | 'error'>('success');

  // 当实体变化时，获取详细信息
  useEffect(() => {
    if (visible && entity) {
      fetchEntityDetail(entity.entity_id);
    }
  }, [visible, entity]);

  // 获取实体详细信息
  const fetchEntityDetail = async (entityId: string) => {
    try {
      const [detail, sources] = await Promise.all([
        getEntityDetail(entityId),
        getEntitySources(entityId)
      ]);
      setEntityDetail(detail);
      setEntitySources(sources);
    } catch (error) {
      console.error('获取实体详情失败:', error);
      message.error('获取实体详情失败');
    }
  };

  // 复制实体JSON到剪贴板
  const copyEntityJSON = () => {
    if (!entity) return;
    
    const entityJSON = JSON.stringify(entity, null, 2);
    navigator.clipboard.writeText(entityJSON)
      .then(() => {
        // 显示成功提示
        setCopyStatus('success');
        setShowCopyNotification(true);
        // 3秒后自动隐藏提示
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 3000);
      })
      .catch(() => {
        // 显示错误提示
        setCopyStatus('error');
        setShowCopyNotification(true);
        // 3秒后自动隐藏提示
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 3000);
      });
  };

  // 复制提示组件
  const CopyNotification = () => (
    showCopyNotification && (
      <div 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: copyStatus === 'success' ? '#f6ffed' : '#fff2f0',
          color: copyStatus === 'success' ? '#52c41a' : '#ff4d4f',
          border: `1px solid ${copyStatus === 'success' ? '#b7eb8f' : '#ffccc7'}`,
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
        {copyStatus === 'success' ? '✓ 内容已复制到剪贴板' : '✗ 复制失败，请重试'}
      </div>
    )
  );

  // 查看语料 - 在新窗口打开Kibana界面
  const viewCorpus = () => {
    if (!entity) return;
    
    // 构建Kibana URL，拼接正确的query参数
    // 假设Kibana运行在本地5601端口，根据实际部署情况调整
    const kibanaBaseUrl = 'http://localhost:5601';
    const query = encodeURIComponent(`entity_id:"${entity.entity_id}"`);
    const kibanaUrl = `${kibanaBaseUrl}/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(_source),filters:!(),index:'entities*',interval:auto,query:(language:kuery,query:'${query}'),sort:!())`;
    
    window.open(kibanaUrl, '_blank');
  };

  





  return (
    <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>知识点详情</span>
          <Space size="small" wrap>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <div key="copy-container" style={{ position: 'relative', display: 'inline-block' }}>
          <Button icon={<CopyOutlined />} onClick={() => copyEntityJSON()}>
            复制JSON
          </Button>
          <CopyNotification />
        </div>,
        <Button key="corpus" icon={<ExportOutlined />} onClick={() => viewCorpus()}>
          查看语料
        </Button>,
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width={800}
    >
      {entity && (
        <Tabs 
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="实体ID">
                    <Text code>{entity.entity_id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="实体名称">
                    <Text strong>{entity.entity_name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="描述">
                    <Paragraph>{entity.description}</Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="有效性结果">
                    <Tag color={entity.validity_result === '有效' ? 'green' : 'red'}>
                      {entity.validity_result}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="有效性方法">
                    {entity.validity_method}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {new Date(entity.created_at).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="更新时间">
                    {new Date(entity.updated_at).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>
              )
            },
            {
              key: 'paths',
              label: '知识路径',
              children: (
                entityDetail && entityDetail.paths.length > 0 ? (
                  <div>
                    <Title level={5}>该知识点在以下路径中出现：</Title>
                    {entityDetail.paths.map((path, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                          {path}
                        </Tag>
                      </div>
                    ))}
                    <Divider />
                    <Title level={5}>所属领域：</Title>
                    <Space wrap>
                      {entityDetail.domains.map((domain, index) => (
                        <Tag key={index} color="purple">
                          {domain}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                ) : (
                  <div>暂无路径信息</div>
                )
              )
            },
            {
              key: 'sources',
              label: '知识来源',
              children: (
                entitySources && entitySources.length > 0 ? (
                  <div>
                    <Title level={5}>该知识点的相关来源信息：</Title>
                    <style>{`
                      .source-table-wrapper {
                        width: 100%;
                      }
                      .source-table-wrapper .ant-descriptions-view {
                        width: 100%;
                        table-layout: fixed;
                      }
                      .source-table-wrapper .ant-descriptions-item-label {
                        width: 20%;
                      }
                      .source-table-wrapper .ant-descriptions-item-content {
                        width: 80%;
                      }
                      @media (max-width: 768px) {
                        .source-table-wrapper .ant-descriptions-item-label,
                        .source-table-wrapper .ant-descriptions-item-content {
                          width: 100%;
                        }
                      }
                    `}</style>
                    {entitySources.map((source, index) => (
                      <div key={source.source_id} className="source-table-wrapper" style={{ marginBottom: 16 }}>
                        <Descriptions column={1} bordered size="small">
                          <Descriptions.Item label="来源类型">
                            <Tag color="orange">{source.source_type}</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="来源引用">
                            <Text code style={{ wordBreak: 'break-all' }}>{source.source_ref}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="创建时间">
                            {new Date(source.created_at).toLocaleString()}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>暂无来源信息</div>
                )
              )
            }
          ]}
        />
      )}
    </Modal>
  );
};

export default EntityDetailModal;
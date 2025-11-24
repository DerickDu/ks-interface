import React from 'react';
import { Divider, Row, Col, Card, Tag, Typography, Statistic } from 'antd';
import { CaretRightOutlined, CaretDownOutlined,
  FileTextOutlined,
  BookOutlined,
  AuditOutlined,
  FilePdfOutlined,
  ProfileOutlined,
  ReadOutlined,
  SnippetsOutlined,
  FileWordOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface DomainStatsData {
  name: string;
  value: number;
}

interface SourceStatisticsProps {
  domainStats: DomainStatsData[];
  isSourcesExpanded: boolean;
  toggleSourcesExpanded: () => void;
  cardStyle?: React.CSSProperties;
  isLoading?: boolean;
}

const SourceStatistics: React.FC<SourceStatisticsProps> = ({
  domainStats,
  isSourcesExpanded,
  toggleSourcesExpanded,
  cardStyle = {},
  isLoading = false,
}) => {
  // 根据来源类型获取对应的图标
  const getSourceIcon = (type: string): React.ReactNode => {
    const iconProps = {
      style: { fontSize: '14px' },
    };

    switch (type) {
      case '技术文档':
        return <FileTextOutlined {...iconProps} />;
      case '学术论文':
      case '研究论文':
        return <BookOutlined {...iconProps} />;
      case '技术规范':
        return <AuditOutlined {...iconProps} />;
      case '专利文献':
        return <FilePdfOutlined {...iconProps} />;
      case '实验报告':
        return <ProfileOutlined {...iconProps} />;
      case '教科书':
        return <ReadOutlined {...iconProps} />;
      case '行业标准':
        return <SnippetsOutlined {...iconProps} />;
      case '技术白皮书':
        return <FileWordOutlined {...iconProps} />;
      case '会议记录':
        return <FileTextOutlined {...iconProps} />;
      case '实验':
        return <ExperimentOutlined {...iconProps} />;
      default:
        return <FileTextOutlined {...iconProps} />;
    }
  };

  // 根据来源类型获取对应的标签颜色
  const getSourceTagColor = (type: string): string => {
    switch (type) {
      case '技术文档':
        return 'blue';
      case '学术论文':
        return 'green';
      case '技术规范':
        return 'orange';
      case '专利文献':
        return 'purple';
      case '实验报告':
        return 'cyan';
      case '教科书':
        return 'magenta';
      case '行业标准':
        return 'gold';
      case '技术白皮书':
        return 'volcano';
      case '会议记录':
        return 'geekblue';
      case '研究论文':
        return 'lime';
      default:
        return 'default';
    }
  };

  // 渲染来源统计折叠/展开控件
  const renderToggleControl = () => {
    return (
      <div
        style={{
          textAlign: 'center' as const,
          marginTop: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            transition: 'background-color 0.3s ease',
          }}
          onClick={toggleSourcesExpanded}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
        >
          {isSourcesExpanded ? (
            <>
              <CaretDownOutlined style={{ marginRight: '4px' }} />
              <span>收起来源统计</span>
            </>
          ) : (
            <>
              <CaretRightOutlined style={{ marginRight: '4px' }} />
              <span>展开来源统计</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>数据来源统计</Title>
        </div>
      }
      style={cardStyle}
      loading={isLoading}
      headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
    >
      {renderToggleControl()}
      
      {isSourcesExpanded && (
        <div style={{ overflow: 'hidden' }}>
          <Divider style={{ margin: '8px 0', backgroundColor: '#f0f0f0' }} />
          
          <Row gutter={[16, 16]}>
            {domainStats.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card 
                  size="small"
                  style={{
                    borderLeft: `4px solid ${getSourceTagColor(item.name) === 'blue' ? '#1890ff' : 
                              getSourceTagColor(item.name) === 'green' ? '#52c41a' : '#faad14'}`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    {getSourceIcon(item.name)}
                    <Tag 
                      color={getSourceTagColor(item.name)} 
                      style={{ marginLeft: '8px', marginBottom: 0 }}
                    >
                      {item.name}
                    </Tag>
                  </div>
                  <Statistic 
                    value={item.value} 
                    suffix="个资源"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          
          {/* 响应式布局调整 */}
          <div 
            style={{
              textAlign: 'center' as const,
              marginTop: '8px',
              fontSize: '12px',
              color: '#888',
            }}
          >
            共 {domainStats.reduce((sum, item) => sum + item.value, 0)} 个数据来源
          </div>
        </div>
      )}
    </Card>
  );
};

export default SourceStatistics;
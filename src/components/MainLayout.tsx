import React, { useState, useRef, useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic, Divider, Tag, Spin } from 'antd';
import { 
  DatabaseOutlined, 
  WifiOutlined, 
  DesktopOutlined, 
  CalculatorOutlined, 
  ExperimentOutlined, 
  BulbOutlined,
  FileTextOutlined,
  BookOutlined,
  FilePdfOutlined,
  AuditOutlined,
  SnippetsOutlined,
  ReadOutlined,
  ProfileOutlined,
  FileWordOutlined
} from '@ant-design/icons';
import Header from './Header';
import Footer from './Footer';
import KnowledgeTree from './KnowledgeTree';
import { fetchEntities, fetchCatalogs, getEntitySources } from '../services/dataService';
import type { Entity, Catalog, EntitySourceDetail } from '../types';

// 使用与KnowledgeTree组件中相同的接口定义
interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
}

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const knowledgeTreeRef = useRef<KnowledgeTreeRef | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [sources, setSources] = useState<EntitySourceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntities: 0,
    communicationCount: 0,
    domainCounts: {
      计算机: 0,
      数学: 0,
      自然科学: 0,
      电子科学: 0
    },
    sourceTypes: {} as Record<string, number>
  });

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleSearch = (value: string) => {
    // 搜索功能现在由Header组件处理
    console.log('全局搜索:', value);
  };

  const handleEntityClick = (entity: Entity) => {
    // 将实体点击事件传递给KnowledgeTree组件
    if (knowledgeTreeRef.current) {
      knowledgeTreeRef.current.handleEntityClick(entity);
    }
  };

  // 获取统计数据
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // 获取所有数据
        const [entitiesData, catalogsData] = await Promise.all([
          fetchEntities(),
          fetchCatalogs()
        ]);

        setEntities(entitiesData);
        setCatalogs(catalogsData);

        // 计算统计数据
        const totalEntities = entitiesData.length;
        
        // 计算通信类节点数量（根据mock数据，所有节点都在通信领域）
        const communicationCount = catalogsData.filter(c => c.domain === '通信').length;
        
        // 计算各Domain分类节点数量
        const domainCounts = {
          计算机: catalogsData.filter(c => c.domain === '计算机').length,
          数学: catalogsData.filter(c => c.domain === '数学').length,
          自然科学: catalogsData.filter(c => c.domain === '自然科学').length,
          电子科学: catalogsData.filter(c => c.domain === '电子科学').length
        };
        
        // 计算来源类型统计
        // 先获取所有实体的源信息
        const allSources: EntitySourceDetail[] = [];
        for (const entity of entitiesData) {
          const entitySources = await getEntitySources(entity.entity_id);
          allSources.push(...entitySources);
        }
        
        setSources(allSources);
        
        // 统计来源类型
        const sourceTypes: Record<string, number> = {};
        allSources.forEach(source => {
          sourceTypes[source.source_type] = (sourceTypes[source.source_type] || 0) + 1;
        });
        
        setStats({
          totalEntities,
          communicationCount,
          domainCounts,
          sourceTypes
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        collapsed={collapsed} 
        onToggle={handleToggle}
        onSearch={handleSearch}
        onEntityClick={handleEntityClick}
      />
      <Content style={{ 
        padding: '16px', 
        background: '#f0f2f5',
        flex: 1,
        overflow: 'auto'
      }}>
        <Row gutter={16} style={{ height: '100%' }}>
          {/* 左侧区域 - 知识树 */}
          <Col xs={24} lg={16} style={{ height: '100%', marginBottom: '16px' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
              overflow: 'hidden'
            }}>
              <KnowledgeTree ref={knowledgeTreeRef} />
            </div>
          </Col>
          
          {/* 右侧区域 - 数据统计 */}
          <Col xs={24} lg={8}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
              overflowY: 'auto'
            }}>
              <Spin spinning={loading}>
                <div>
                  <h2 style={{ 
                    marginBottom: '24px', 
                    color: '#1890ff', 
                    textAlign: 'center',
                    padding: '12px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '6px'
                  }}>
                    <DatabaseOutlined style={{ marginRight: '8px' }} />
                    知识点统计
                  </h2>
                  
                  {/* 总量统计 */}
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col span={24}>
                      <Card>
                        <Statistic 
                          title="知识点总量" 
                          value={stats.totalEntities} 
                          prefix={<DatabaseOutlined />}
                          suffix="个"
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  <Divider orientation="left">分类统计</Divider>
                  
                  {/* 通信类节点统计 */}
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col span={24}>
                      <Card>
                        <Statistic 
                          title="通信类节点" 
                          value={stats.communicationCount} 
                          prefix={<WifiOutlined />}
                          suffix="个"
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Domain分类统计 */}
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic 
                          title="计算机" 
                          value={stats.domainCounts.计算机} 
                          prefix={<DesktopOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic 
                          title="数学" 
                          value={stats.domainCounts.数学} 
                          prefix={<CalculatorOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic 
                          title="自然科学" 
                          value={stats.domainCounts.自然科学} 
                          prefix={<ExperimentOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic 
                          title="电子科学" 
                          value={stats.domainCounts.电子科学} 
                          prefix={<BulbOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  <Divider orientation="left" style={{ margin: '12px 0' }}>来源统计</Divider>
                  
                  {/* 来源类型统计 */}
                  <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                    {Object.entries(stats.sourceTypes).map(([type, count]) => (
                      <Col xs={24} sm={12} md={8} lg={12} xl={8} key={type}>
                        <Card size="small" style={{ textAlign: 'center', padding: '8px' }}>
                          <Tag 
                            color={
                              type === '技术文档' ? 'blue' : 
                              type === '学术论文' ? 'green' : 
                              type === '技术规范' ? 'orange' : 
                              type === '专利文献' ? 'purple' : 
                              type === '实验报告' ? 'cyan' : 
                              type === '教科书' ? 'magenta' : 
                              type === '行业标准' ? 'gold' : 
                              type === '技术白皮书' ? 'volcano' : 
                              type === '会议记录' ? 'geekblue' : 
                              type === '研究论文' ? 'lime' : 'default'
                            }
                            style={{ 
                              fontSize: '12px', 
                              padding: '2px 8px',
                              marginBottom: '4px'
                            }}
                          >
                            {type === '技术文档' ? <FileTextOutlined /> : 
                             type === '学术论文' ? <BookOutlined /> : 
                             type === '技术规范' ? <AuditOutlined /> : 
                             type === '专利文献' ? <FilePdfOutlined /> : 
                             type === '实验报告' ? <ProfileOutlined /> : 
                             type === '教科书' ? <ReadOutlined /> : 
                             type === '行业标准' ? <SnippetsOutlined /> : 
                             type === '技术白皮书' ? <FileWordOutlined /> : 
                             type === '会议记录' ? <FileTextOutlined /> : 
                             type === '研究论文' ? <BookOutlined /> : <FileTextOutlined />}
                            <span style={{ marginLeft: '4px' }}>{type}</span>
                          </Tag>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                            {count} 个
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Spin>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
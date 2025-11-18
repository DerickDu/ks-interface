import React, { useState, useRef } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import KnowledgeTree from './KnowledgeTree';
import type { Entity } from '../types';

// 使用与KnowledgeTree组件中相同的接口定义
interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
}

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const knowledgeTreeRef = useRef<KnowledgeTreeRef | null>(null);

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        collapsed={collapsed} 
        onToggle={handleToggle}
        onSearch={handleSearch}
        onEntityClick={handleEntityClick}
      />
      <Content style={{ 
        padding: '0', 
        background: '#f0f2f5',
        flex: 1,
        overflow: 'auto'
      }}>
        <KnowledgeTree ref={knowledgeTreeRef} />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
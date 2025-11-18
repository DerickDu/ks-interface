import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Typography, Input, Card, List, Tag, Empty, Spin } from 'antd';
import { 
  UserOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { Entity, SearchResult } from '../types';
import { searchEntities } from '../services/dataService';

// 添加自定义样式
const customSearchStyles = `
  .custom-search-container {
    display: flex;
    align-items: center;
  }
  
  .custom-search-container .ant-input-group-wrapper {
    display: flex;
    align-items: center;
  }
  
  .custom-search-container .ant-input-wrapper {
    display: flex;
    align-items: center;
  }
  
  .custom-search-container .ant-input-affix-wrapper {
    display: flex;
    align-items: center;
  }
  
  .custom-search-container .ant-input-group-addon {
    display: flex;
    align-items: center;
  }
  
  .custom-search-container .ant-input-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    min-width: 40px;
    padding: 0 10px;
    transition: all 0.3s;
  }
  
  /* 悬停效果 */
  .custom-search-container .ant-input-search-button:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* 点击效果 */
  .custom-search-container .ant-input-search-button:active {
    transform: scale(0.98);
  }
  
  /* 响应式设计：在小屏幕上适当调整 */
  @media (max-width: 768px) {
    .custom-search-container .ant-input-search-button {
      width: 36px;
      min-width: 36px;
      padding: 0 8px;
    }
  }
  
  @media (max-width: 480px) {
    .custom-search-container .ant-input-search-button {
      width: 32px;
      min-width: 32px;
      padding: 0 6px;
    }
  }
`;


const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onSearch?: (value: string) => void;
  onEntityClick?: (entity: Entity) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  collapsed = false, 
  onToggle,
  onEntityClick
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 用户菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理搜索
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchEntities(searchValue.trim());
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 处理搜索结果点击
  const handleSearchResultClick = (entity: Entity) => {
    setShowSearchResults(false);
    setSearchValue('');
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理用户菜单点击
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        // 处理个人资料点击
        console.log('个人资料');
        break;
      case 'settings':
        // 处理设置点击
        console.log('设置');
        break;
      case 'logout':
        // 处理退出登录
        console.log('退出登录');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <style>{customSearchStyles}</style>
      <AntHeader 
        style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onToggle && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{ marginRight: 16 }}
          />
        )}
        
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          通信领域知识体系
        </Title>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div ref={searchRef} style={{ position: 'relative', width: 320 }} className="custom-search-container">
          <Space.Compact style={{ width: '100%' }}>
            <Input.Search
              placeholder="搜索知识点..."
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              onFocus={() => searchValue.trim() && setShowSearchResults(true)}
              style={{ width: '100%' }}
            />
          </Space.Compact>
          
          {/* 搜索结果下拉框 */}
          {showSearchResults && (
            <Card
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: '400px',
                overflow: 'auto',
                marginTop: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              bodyStyle={{ padding: 0 }}
            >
              {searchLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : searchResults.length > 0 ? (
                <List
                  size="small"
                  dataSource={searchResults}
                  renderItem={(result) => (
                    <List.Item
                      style={{ cursor: 'pointer', padding: '12px 16px' }}
                      onClick={() => handleSearchResultClick(result.entity)}
                    >
                      <List.Item.Meta
                        title={
                          <div>
                            <span>{result.entity.entity_name}</span>
                            <Tag 
                              color={result.entity.validity_result === '有效' ? 'green' : 'red'}
                            >
                              {result.entity.validity_result}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>{result.entity.description}</div>
                            {result.paths && result.paths.length > 0 && (
                              <div style={{ marginTop: 4 }}>
                                {result.paths.slice(0, 2).map((path, index) => (
                                  <Tag key={index} color="green">
                                    {path}
                                  </Tag>
                                ))}
                                {result.paths.length > 2 && (
                                  <Tag>+{result.paths.length - 2} 更多</Tag>
                                )}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty 
                  description="暂无搜索结果" 
                  style={{ padding: '20px' }}
                />
              )}
            </Card>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space size="middle">
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            arrow
          >
            <Button type="text" icon={<Avatar icon={<UserOutlined />} />}>
              用户
            </Button>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
    </>
  );
};

export default Header;
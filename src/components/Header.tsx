import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Input,
  Card,
  List,
  Tag,
  Empty,
  Spin,
} from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { Entity, SearchResult } from "../types";
import { searchEntities } from "../services/dataService";
import styles from "./Header.module.css";

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
  onEntityClick,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 用户菜单项
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
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
      console.error("搜索失败:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 处理搜索结果点击
  const handleSearchResultClick = (entity: Entity) => {
    setShowSearchResults(false);
    setSearchValue("");
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 处理用户菜单点击
  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "profile":
        // 处理个人资料点击
        console.log("个人资料");
        break;
      case "settings":
        // 处理设置点击
        console.log("设置");
        break;
      case "logout":
        // 处理退出登录
        console.log("退出登录");
        break;
      default:
        break;
    }
  };

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        {onToggle && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            className={styles.toggleButton}
          />
        )}

        <Title level={3} className={styles.headerTitle}>
          通信领域知识体系
        </Title>
      </div>

      <div className={styles.headerCenter}>
        <div
          ref={searchRef}
          className={`${styles.searchContainer} custom-search-container`}
        >
          <Space.Compact className={styles.fullWidth}>
            <Input.Search
              placeholder="搜索知识点..."
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              onFocus={() => searchValue.trim() && setShowSearchResults(true)}
              className={styles.fullWidth}
            />
          </Space.Compact>

          {/* 搜索结果下拉框 */}
          {showSearchResults && (
            <Card
              className={styles.searchResultsCard}
              bodyStyle={{ padding: 0 }}
            >
              {searchLoading ? (
                <div className={styles.searchLoading}>
                  <Spin size="small" />
                </div>
              ) : searchResults.length > 0 ? (
                <List
                  size="small"
                  dataSource={searchResults}
                  renderItem={(result) => (
                    <List.Item
                      className={styles.searchResultItem}
                      onClick={() => handleSearchResultClick(result.entity)}
                    >
                      <List.Item.Meta
                        title={
                          <div>
                            <span>{result.entity.entity_name}</span>
                            <Tag
                              color={
                                result.entity.validity_result === "有效"
                                  ? "green"
                                  : "red"
                              }
                            >
                              {result.entity.validity_result}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>{result.entity.description}</div>
                            {result.paths && result.paths.length > 0 && (
                              <div className={styles.searchResultDescription}>
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
                  className={styles.noResults}
                />
              )}
            </Card>
          )}
        </div>
      </div>

      <div className={styles.headerRight}>
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
  );
};

export default Header;

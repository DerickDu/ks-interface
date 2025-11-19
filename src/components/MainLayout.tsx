import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Row, Col, Card, Statistic, Divider, Tag } from "antd";
import {
  DatabaseOutlined,
  WifiOutlined,
  FileTextOutlined,
  BookOutlined,
  AuditOutlined,
  FilePdfOutlined,
  ProfileOutlined,
  ReadOutlined,
  SnippetsOutlined,
  FileWordOutlined,
  ExperimentOutlined,
  BulbOutlined,
  DesktopOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import KnowledgeTree from "./KnowledgeTree";
import Header from "./Header";
import Footer from "./Footer";

import {
  fetchEntities,
  fetchCatalogs,
  getEntitySources,
} from "../services/dataService";
import type { Entity, EntitySourceDetail } from "../types";

// 添加响应式样式
const responsiveStyles = `
  /* 统计卡片容器基础样式 */
  .statistics-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  /* 统计卡片行基础样式 */
  .statistics-row {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  /* 统计卡片基础样式 */
  .statistics-card {
    flex: 1;
    min-width: 0;
  }

  /* 当可以并排显示时的布局 */
  .can-show-side-by-side .statistics-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .can-show-side-by-side .statistics-row {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  .can-show-side-by-side .primary-statistics-row .statistics-card {
    flex: 1;
  }

  .can-show-side-by-side .domain-statistics-row .statistics-card {
    flex: 1;
  }

  /* 当不能并排显示时的紧凑布局 */
  .cannot-show-side-by-side .statistics-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cannot-show-side-by-side .compact-statistics-row {
    display: flex;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: thin;
  }

  .cannot-show-side-by-side .compact-statistics-row::-webkit-scrollbar {
    height: 6px;
  }

  .cannot-show-side-by-side .compact-statistics-row::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }

  /* 主要统计卡片（知识点总量和通信节点）- 更宽 */
  .cannot-show-side-by-side .compact-statistics-card.primary {
    flex: 1.5;
    min-width: 150px;
    max-width: 220px;
  }

  /* 学科分类卡片 - 较窄 */
  .cannot-show-side-by-side .compact-statistics-card.domain {
    flex: 1;
    min-width: 100px;
    max-width: 150px;
  }

  /* 移动设备适配 */
  @media (max-width: 767px) {
    .statistics-container {
      gap: 8px;
    }

    .statistics-row {
      gap: 8px;
    }

    /* 主要统计卡片（知识点总量和通信节点）- 移动设备上更宽 */
    .cannot-show-side-by-side .compact-statistics-card.primary {
      min-width: 120px;
      max-width: 170px;
    }

    /* 学科分类卡片 - 移动设备上较窄 */
    .cannot-show-side-by-side .compact-statistics-card.domain {
      min-width: 80px;
      max-width: 110px;
    }
    
    /* 在小屏幕设备上隐藏分类统计的Divider */
    .cannot-show-side-by-side .ant-divider {
      display: none;
    }
  }

  /* 平板设备适配 */
  @media (min-width: 768px) and (max-width: 1023px) {
    /* 主要统计卡片（知识点总量和通信节点）- 平板设备上更宽 */
    .cannot-show-side-by-side .compact-statistics-card.primary {
      min-width: 140px;
      max-width: 200px;
    }

    /* 学科分类卡片 - 平板设备上较窄 */
    .cannot-show-side-by-side .compact-statistics-card.domain {
      min-width: 90px;
      max-width: 130px;
    }
  }

  /* 桌面设备适配 */
  @media (min-width: 1024px) {
    /* 主要统计卡片（知识点总量和通信节点）- 桌面设备上更宽 */
    .cannot-show-side-by-side .compact-statistics-card.primary {
      min-width: 150px;
      max-width: 220px;
    }

    /* 学科分类卡片 - 桌面设备上较窄 */
    .cannot-show-side-by-side .compact-statistics-card.domain {
      min-width: 100px;
      max-width: 150px;
    }
  }
`;

// 使用与KnowledgeTree组件中相同的接口定义
interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
}

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const knowledgeTreeRef = useRef<KnowledgeTreeRef | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntities: 0,
    communicationCount: 0,
    domainCounts: {
      通信: 0,
      自然科学: 0,
      电路与电子: 0,
      计算机: 0,
      数学: 0,
    },
    sourceTypes: {} as Record<string, number>,
  });
  const [isSourceCollapsed, setIsSourceCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [canShowSideBySide, setCanShowSideBySide] = useState(true); // 新增状态：是否能并排显示
  const leftPanelRef = useRef<HTMLDivElement>(null); // 左侧面板引用
  const rightPanelRef = useRef<HTMLDivElement>(null); // 右侧面板引用

  useEffect(() => {
    // 注入响应式样式
    const styleElement = document.createElement("style");
    styleElement.innerHTML = responsiveStyles;
    document.head.appendChild(styleElement);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // 检测两个区域是否能并排显示
      if (leftPanelRef.current && rightPanelRef.current) {
        const leftRect = leftPanelRef.current.getBoundingClientRect();
        const rightRect = rightPanelRef.current.getBoundingClientRect();

        // 检查是否在同一水平线上
        const isSideBySide = Math.abs(leftRect.top - rightRect.top) < 10;
        setCanShowSideBySide(isSideBySide);

        // 只有在不能并排显示时才默认折叠来源统计
        if (!isSideBySide) {
          setIsSourceCollapsed(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // 初始检测
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      // 清理样式元素
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []); // 依赖项数组保持为空

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleSearch = (value: string) => {
    // 搜索功能现在由Header组件处理
    console.log("全局搜索:", value);
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
          fetchCatalogs(),
        ]);

        // 计算统计数据
        const totalEntities = entitiesData.length;

        // 计算通信类节点数量（根据mock数据，所有节点都在通信领域）
        const communicationCount = catalogsData.filter(
          (c) => c.domain === "通信"
        ).length;

        // 计算各Domain分类节点数量
        const domainCounts = {
          通信: catalogsData.filter((c) => c.domain === "通信").length,
          自然科学: catalogsData.filter((c) => c.domain === "自然科学").length,
          电路与电子: catalogsData.filter((c) => c.domain === "电路与电子")
            .length,
          计算机: catalogsData.filter((c) => c.domain === "计算机").length,
          数学: catalogsData.filter((c) => c.domain === "数学").length,
        };

        // 计算来源类型统计
        // 先获取所有实体的源信息
        const allSources: EntitySourceDetail[] = [];
        for (const entity of entitiesData) {
          const entitySources = await getEntitySources(entity.entity_id);
          allSources.push(...entitySources);
        }

        // 统计来源类型
        const sourceTypes: Record<string, number> = {};
        allSources.forEach((source) => {
          sourceTypes[source.source_type] =
            (sourceTypes[source.source_type] || 0) + 1;
        });

        setStats({
          totalEntities,
          communicationCount,
          domainCounts,
          sourceTypes,
        });
      } catch (error) {
        console.error("获取统计数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className={canShowSideBySide ? "can-show-side-by-side" : ""}
    >
      <Header
        collapsed={collapsed}
        onToggle={handleToggle}
        onSearch={handleSearch}
        onEntityClick={handleEntityClick}
      />
      <Content
        style={{
          padding: "16px",
          background: "#f0f2f5",
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row
          gutter={[16, { xs: 8, sm: 12, md: 16 }]}
          style={{
            width: "100%",
            maxWidth: "1400px",
            height: "calc(100vh - 120px)",
          }}
        >
          {/* 左侧区域 - 数据统计 */}
          <Col xs={24} lg={10} order={isMobile ? -1 : 0}>
            <div
              ref={leftPanelRef}
              style={{
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: "6px",
                padding: isMobile ? "8px" : "12px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                overflowY: "auto",
              }}
            >
              <Spin spinning={loading}>
                <div>
                  <h2
                    style={{
                      marginBottom: isMobile ? "12px" : "16px",
                      color: "#1890ff",
                      textAlign: "center",
                      padding: isMobile ? "6px" : "8px",
                      backgroundColor: "#f0f2f5",
                      borderRadius: "4px",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    <DatabaseOutlined
                      style={{
                        marginRight: isMobile ? "4px" : "6px",
                        fontSize: isMobile ? "12px" : "14px",
                      }}
                    />
                    知识点统计
                  </h2>

                  {/* 统一容器包含所有统计卡片 */}
                  <div
                    className={`statistics-container ${
                      canShowSideBySide
                        ? "can-show-side-by-side"
                        : "cannot-show-side-by-side"
                    }`}
                  >
                    {/* 当可以并排显示时，保持原有布局 */}
                    {canShowSideBySide ? (
                      <>
                        {/* 第一行：知识点总量和通信节点并排显示 */}
                        <div className="statistics-row primary-statistics-row">
                          {/* 知识点总量卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "6px" : "8px",
                                height: "100%",
                                backgroundColor: "#f0f5ff",
                                border: "1px solid #adc6ff",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(24, 144, 255, 0.1)",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "11px" : "12px",
                                      color: "#1890ff",
                                      fontWeight: "500",
                                    }}
                                  >
                                    知识点总量
                                  </span>
                                }
                                value={stats.totalEntities}
                                prefix={
                                  <DatabaseOutlined
                                    style={{
                                      color: "#1890ff",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "16px" : "18px",
                                  color: "#1890ff",
                                  fontWeight: "600",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 通信类节点卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "6px" : "8px",
                                height: "100%",
                                backgroundColor: "#f6ffed",
                                border: "1px solid #b7eb8f",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(82, 196, 26, 0.1)",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "11px" : "12px",
                                      color: "#52c41a",
                                      fontWeight: "500",
                                    }}
                                  >
                                    通信类节点
                                  </span>
                                }
                                value={stats.communicationCount}
                                prefix={
                                  <WifiOutlined
                                    style={{
                                      color: "#52c41a",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "16px" : "18px",
                                  color: "#52c41a",
                                  fontWeight: "600",
                                }}
                              />
                            </Card>
                          </div>
                        </div>

                        {/* 第二行：四个学科类别统计卡片 */}
                        <div className="statistics-row domain-statistics-row">
                          {/* 自然科学卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "9px" : "10px",
                                    }}
                                  >
                                    自然科学
                                  </span>
                                }
                                value={stats.domainCounts.自然科学 || 0}
                                prefix={<ExperimentOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 电路与电子卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "9px" : "10px",
                                    }}
                                  >
                                    电路与电子
                                  </span>
                                }
                                value={stats.domainCounts.电路与电子 || 0}
                                prefix={<BulbOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 计算机卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "9px" : "10px",
                                    }}
                                  >
                                    计算机
                                  </span>
                                }
                                value={stats.domainCounts.计算机 || 0}
                                prefix={<DesktopOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 数学卡片 */}
                          <div className="statistics-card">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "9px" : "10px",
                                    }}
                                  >
                                    数学
                                  </span>
                                }
                                value={stats.domainCounts.数学 || 0}
                                prefix={<CalculatorOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "14px" : "16px",
                                }}
                              />
                            </Card>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 当不能并排显示时，所有6个卡片组成一个水平排列的卡片组 */}
                        <div className="compact-statistics-row">
                          {/* 知识点总量卡片 */}
                          <div className="compact-statistics-card primary">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                textAlign: "center",
                                height: "100%",
                                backgroundColor: "#f0f5ff",
                                border: "1px solid #adc6ff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(24, 144, 255, 0.15)",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "8px" : "9px",
                                      color: "#1890ff",
                                    }}
                                  >
                                    知识点总量
                                  </span>
                                }
                                value={stats.totalEntities}
                                prefix={
                                  <DatabaseOutlined
                                    style={{
                                      fontSize: isMobile ? "8px" : "9px",
                                      color: "#1890ff",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "12px" : "14px",
                                  color: "#1890ff",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 通信类节点卡片 */}
                          <div className="compact-statistics-card primary">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "4px" : "6px",
                                textAlign: "center",
                                height: "100%",
                                backgroundColor: "#f6ffed",
                                border: "1px solid #b7eb8f",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(82, 196, 26, 0.15)",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "8px" : "9px",
                                      color: "#52c41a",
                                    }}
                                  >
                                    通信类节点
                                  </span>
                                }
                                value={stats.communicationCount}
                                prefix={
                                  <WifiOutlined
                                    style={{
                                      fontSize: isMobile ? "8px" : "9px",
                                      color: "#52c41a",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "12px" : "14px",
                                  color: "#52c41a",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 自然科学卡片 */}
                          <div className="compact-statistics-card domain">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "3px" : "4px",
                                textAlign: "center",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  >
                                    自然科学
                                  </span>
                                }
                                value={stats.domainCounts.自然科学 || 0}
                                prefix={
                                  <ExperimentOutlined
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "10px" : "12px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 电路与电子卡片 */}
                          <div className="compact-statistics-card domain">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "3px" : "4px",
                                textAlign: "center",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  >
                                    电路与电子
                                  </span>
                                }
                                value={stats.domainCounts.电路与电子 || 0}
                                prefix={
                                  <BulbOutlined
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "10px" : "12px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 计算机卡片 */}
                          <div className="compact-statistics-card domain">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "3px" : "4px",
                                textAlign: "center",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  >
                                    计算机
                                  </span>
                                }
                                value={stats.domainCounts.计算机 || 0}
                                prefix={
                                  <DesktopOutlined
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "10px" : "12px",
                                }}
                              />
                            </Card>
                          </div>

                          {/* 数学卡片 */}
                          <div className="compact-statistics-card domain">
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "3px" : "4px",
                                textAlign: "center",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  >
                                    数学
                                  </span>
                                }
                                value={stats.domainCounts.数学 || 0}
                                prefix={
                                  <CalculatorOutlined
                                    style={{
                                      fontSize: isMobile ? "7px" : "8px",
                                    }}
                                  />
                                }
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "10px" : "12px",
                                }}
                              />
                            </Card>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginBottom: isMobile ? "8px" : "12px" }}>
                    {/* 来源类型统计 */}
                    <div
                      style={{
                        maxHeight:
                          isSourceCollapsed && !canShowSideBySide
                            ? "0"
                            : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out",
                        marginTop: isMobile ? "4px" : "6px",
                      }}
                    >
                      <Divider
                        orientation="left"
                        style={{
                          fontSize: isMobile ? "11px" : "12px",
                          margin: "8px 0",
                        }}
                      >
                        来源统计
                      </Divider>
                      <Row gutter={isMobile ? [4, 4] : [6, 6]}>
                        {Object.entries(stats.sourceTypes).map(
                          ([type, count]) => (
                            <Col
                              xs={24}
                              sm={12}
                              md={8}
                              lg={12}
                              xl={8}
                              key={type}
                            >
                              <Card
                                size="small"
                                style={{
                                  textAlign: "center",
                                  padding: isMobile ? "4px" : "6px",
                                }}
                              >
                                <Tag
                                  color={
                                    type === "技术文档"
                                      ? "blue"
                                      : type === "学术论文"
                                      ? "green"
                                      : type === "技术规范"
                                      ? "orange"
                                      : type === "专利文献"
                                      ? "purple"
                                      : type === "实验报告"
                                      ? "cyan"
                                      : type === "教科书"
                                      ? "magenta"
                                      : type === "行业标准"
                                      ? "gold"
                                      : type === "技术白皮书"
                                      ? "volcano"
                                      : type === "会议记录"
                                      ? "geekblue"
                                      : type === "研究论文"
                                      ? "lime"
                                      : "default"
                                  }
                                  style={{
                                    fontSize: isMobile ? "9px" : "10px",
                                    padding: isMobile ? "0px 4px" : "1px 6px",
                                    marginBottom: isMobile ? "2px" : "3px",
                                  }}
                                >
                                  {type === "技术文档" ? (
                                    <FileTextOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "学术论文" ? (
                                    <BookOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "技术规范" ? (
                                    <AuditOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "专利文献" ? (
                                    <FilePdfOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "实验报告" ? (
                                    <ProfileOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "教科书" ? (
                                    <ReadOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "行业标准" ? (
                                    <SnippetsOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "技术白皮书" ? (
                                    <FileWordOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "会议记录" ? (
                                    <FileTextOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : type === "研究论文" ? (
                                    <BookOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  ) : (
                                    <FileTextOutlined
                                      style={{
                                        fontSize: isMobile ? "9px" : "10px",
                                      }}
                                    />
                                  )}
                                  <span
                                    style={{
                                      marginLeft: isMobile ? "2px" : "3px",
                                    }}
                                  >
                                    {type}
                                  </span>
                                </Tag>
                                <div
                                  style={{
                                    fontSize: isMobile ? "11px" : "12px",
                                    fontWeight: "bold",
                                    color: "#1890ff",
                                  }}
                                >
                                  {count} 个
                                </div>
                              </Card>
                            </Col>
                          )
                        )}
                      </Row>
                    </div>

                    {/* 来源统计折叠/展开控件 */}
                    {/* 只有在不能并排显示时才显示折叠按钮 */}
                    {canShowSideBySide ? null : (
                      <div style={{ textAlign: "center", marginTop: "8px" }}>
                        <span
                          onClick={() =>
                            setIsSourceCollapsed(!isSourceCollapsed)
                          }
                          style={{
                            fontSize: isMobile ? "11px" : "12px",
                            color: "#1890ff",
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#f0f2f5",
                          }}
                        >
                          {isSourceCollapsed
                            ? "展开来源统计 ▼"
                            : "收起来源统计 ▲"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Spin>
            </div>
          </Col>

          {/* 右侧区域 - 知识树 */}
          <Col xs={24} lg={14} style={{ height: "100%", marginBottom: "16px" }}>
            <div
              ref={rightPanelRef}
              style={{
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <KnowledgeTree ref={knowledgeTreeRef} />
            </div>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;

import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Spin,
  Row,
  Col,
  Card,
  Statistic,
  Divider,
  Tag,
  Button,
} from "antd";
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
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import KnowledgeTree from "./KnowledgeTree";
import Header from "./Header";
import Footer from "./Footer";

import {
  fetchEntities,
  fetchCatalogs,
  getEntitySources,
} from "../services/dataService";
import type { Entity, Catalog, EntitySourceDetail } from "../types";

// 添加响应式样式
const responsiveStyles = `
  .statistics-container {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }

  /* 默认移动设备布局 */
  @media (max-width: 767px) {
    .statistics-container {
      grid-template-columns: 1fr;
    }
    
    .statistics-container .ant-row {
      margin-bottom: 8px !important;
    }
    
    .statistics-container .ant-card {
      text-align: center;
    }
    
    /* 在小屏幕设备上隐藏分类统计的Divider */
    .statistics-container .ant-divider {
      display: none;
    }
  }

  /* 平板设备布局 */
  @media (min-width: 768px) and (max-width: 1023px) {
    .statistics-container {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .statistics-container > .ant-row:first-child {
      grid-column: 1 / -1;
    }
  }

  /* 桌面设备布局 */
  @media (min-width: 1024px) {
    .statistics-container {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .statistics-container > .ant-row:first-child {
      grid-column: 1 / -1;
    }
  }

  /* 当可以并排显示时的特殊处理 */
  @media (min-width: 1200px) {
    .can-show-side-by-side .statistics-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* 当不能并排显示时的紧凑布局 */
  .compact-statistics-row {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: thin;
    margin-bottom: 8px;
  }

  .compact-statistics-row::-webkit-scrollbar {
    height: 6px;
  }

  .compact-statistics-row::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }

  /* 紧凑布局下的统计卡片 */
  .compact-statistics-card {
    min-width: 120px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  /* 移动端紧凑布局 */
  @media (max-width: 767px) {
    .compact-statistics-card {
      min-width: 100px;
      margin-right: 6px;
    }
    
    /* 在小屏幕设备上隐藏分类统计的Divider */
    .can-show-side-by-side-false .ant-divider {
      display: none;
    }
  }

  /* 平板端紧凑布局 */
  @media (min-width: 768px) and (max-width: 1023px) {
    .compact-statistics-card {
      min-width: 110px;
      margin-right: 7px;
    }
  }

  /* 桌面端紧凑布局 */
  @media (min-width: 1024px) {
    .compact-statistics-card {
      min-width: 130px;
      margin-right: 10px;
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
  const [entities, setEntities] = useState<Entity[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [sources, setSources] = useState<EntitySourceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntities: 0,
    communicationCount: 0,
    domainCounts: {
      通信: 0,
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

        setEntities(entitiesData);
        setCatalogs(catalogsData);

        // 计算统计数据
        const totalEntities = entitiesData.length;

        // 计算通信类节点数量（根据mock数据，所有节点都在通信领域）
        const communicationCount = catalogsData.filter(
          (c) => c.domain === "通信"
        ).length;

        // 计算各Domain分类节点数量（仅包含通信类别）
        const domainCounts = {
          通信: catalogsData.filter((c) => c.domain === "通信").length,
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
                  <div className="statistics-container">
                    {/* 当可以并排显示时，保持原有布局 */}
                    {canShowSideBySide ? (
                      <>
                        {/* 第一行：知识点总量和通信节点并排显示 */}
                        <Row
                          gutter={isMobile ? 8 : 12}
                          style={{ marginBottom: isMobile ? "8px" : "12px" }}
                        >
                          <Col span={12}>
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "6px" : "8px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "11px" : "12px",
                                    }}
                                  >
                                    知识点总量
                                  </span>
                                }
                                value={stats.totalEntities}
                                prefix={<DatabaseOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "16px" : "18px",
                                }}
                              />
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card
                              size="small"
                              style={{
                                padding: isMobile ? "6px" : "8px",
                                height: "100%",
                              }}
                            >
                              <Statistic
                                title={
                                  <span
                                    style={{
                                      fontSize: isMobile ? "11px" : "12px",
                                    }}
                                  >
                                    通信类节点
                                  </span>
                                }
                                value={stats.communicationCount}
                                prefix={<WifiOutlined />}
                                suffix="个"
                                valueStyle={{
                                  fontSize: isMobile ? "16px" : "18px",
                                }}
                              />
                            </Card>
                          </Col>
                        </Row>
                        {/* 分类统计区域 - 移除了Divider分隔线，保持简洁布局 */}
                      </>
                    ) : (
                      // 当不能并排显示时，第一行保持知识点总量和通信节点卡片并排显示
                      <div className="compact-statistics-row">
                        {/* 总量统计卡片 */}
                        <div className="compact-statistics-card">
                          <Card
                            size="small"
                            style={{
                              padding: isMobile ? "4px" : "6px",
                              textAlign: "center",
                              height: "100%",
                            }}
                          >
                            <Statistic
                              title={
                                <span
                                  style={{ fontSize: isMobile ? "8px" : "9px" }}
                                >
                                  知识点总量
                                </span>
                              }
                              value={stats.totalEntities}
                              prefix={
                                <DatabaseOutlined
                                  style={{ fontSize: isMobile ? "8px" : "9px" }}
                                />
                              }
                              suffix="个"
                              valueStyle={{
                                fontSize: isMobile ? "12px" : "14px",
                              }}
                            />
                          </Card>
                        </div>

                        {/* 通信类节点统计卡片 */}
                        <div className="compact-statistics-card">
                          <Card
                            size="small"
                            style={{
                              padding: isMobile ? "4px" : "6px",
                              textAlign: "center",
                              height: "100%",
                            }}
                          >
                            <Statistic
                              title={
                                <span
                                  style={{ fontSize: isMobile ? "8px" : "9px" }}
                                >
                                  通信类节点
                                </span>
                              }
                              value={stats.communicationCount}
                              prefix={
                                <WifiOutlined
                                  style={{ fontSize: isMobile ? "8px" : "9px" }}
                                />
                              }
                              suffix="个"
                              valueStyle={{
                                fontSize: isMobile ? "12px" : "14px",
                              }}
                            />
                          </Card>
                        </div>
                      </div>
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

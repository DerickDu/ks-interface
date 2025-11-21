import React, { useState, useEffect, useRef } from "react";
import { Layout, Row, Col } from "antd";
import KnowledgeTree from "./KnowledgeTree";
import Header from "./Header";
import Footer from "./Footer";
import StatisticsPanel from "./StatisticsPanel";

import type { Entity } from "../types";

// 使用与KnowledgeTree组件中相同的接口定义
interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
}

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const knowledgeTreeRef = useRef<KnowledgeTreeRef | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [canShowSideBySide, setCanShowSideBySide] = useState(true); // 新增状态：是否能并排显示
  const leftPanelRef = useRef<HTMLDivElement>(null); // 左侧面板引用
  const rightPanelRef = useRef<HTMLDivElement>(null); // 右侧面板引用

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // 检测两个区域是否能并排显示
      if (leftPanelRef.current && rightPanelRef.current) {
        const leftRect = leftPanelRef.current.getBoundingClientRect();
        const rightRect = rightPanelRef.current.getBoundingClientRect();

        // 检查是否在同一水平线上
        const isSideBySide = Math.abs(leftRect.top - rightRect.top) < 10;
        setCanShowSideBySide(isSideBySide);
      }
    };

    window.addEventListener("resize", handleResize);

    // 初始检测
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
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
          overflow: "hidden", // 改为hidden，防止水平滚动条
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // 改为flex-start，使内容从顶部开始
          minHeight: "calc(100vh - 64px)", // 设置最小高度为视口高度减去header高度
          paddingBottom: "0", // 移除Content的底部内边距，由Row和div控制
          width: "100%", // 确保Content占满父容器
          boxSizing: "border-box", // 确保边框和内边距包含在宽度内
        }}
      >
        <Row
          gutter={[16, { xs: 8, sm: 12, md: 16 }]}
          style={{
            width: "100%",
            maxWidth: "1400px",
            paddingBottom: "10px", // 减小底部内边距，使内容与footer更接近
            margin: "0 auto", // 确保Row居中
            boxSizing: "border-box", // 确保边框和内边距包含在宽度内
            overflow: "hidden", // 防止内容溢出
          }}
        >
          {/* 左侧区域 - 数据统计 */}
          <Col
            xs={24}
            lg={10}
            order={isMobile ? -1 : 0}
            style={{ width: "100%" }}
          >
            <div
              ref={leftPanelRef}
              style={{
                // 完全移除高度限制，让内容完全自适应
                // height: "calc(100vh - 120px)",
                // minHeight: "200px",
                // maxHeight: "calc(100vh - 120px)",
                backgroundColor: "#fff",
                borderRadius: "6px",
                padding: isMobile ? "8px" : "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                // 移除overflow限制，让内容自由扩展
                overflow: "visible",
                marginBottom: isMobile ? "8px" : "12px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <StatisticsPanel
                isMobile={isMobile}
                canShowSideBySide={canShowSideBySide}
                panelRef={leftPanelRef}
              />
            </div>
          </Col>

          {/* 右侧区域 - 知识树 */}
          <Col xs={24} lg={14} style={{ height: "100%", width: "100%" }}>
            <div
              ref={rightPanelRef}
              style={{
                height: "calc(100vh - 120px)",
                backgroundColor: "#fff",
                borderRadius: "6px",
                padding: "0px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                marginBottom: isMobile ? "8px" : "12px",
                width: "100%", // 确保div完全填充Col组件
                boxSizing: "border-box", // 确保边框和内边距包含在宽度内
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

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
} from "react";
import { Card, Tree, Spin, message, Empty, Button } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import type { Entity } from "../types";
import {
  fetchEntities,
  getDomainSubDomainData,
  getEntitiesBySubDomain,
  type KnowledgeNode,
} from "../services/dataService";
import EntityDetailModal from "./EntityDetailModal";
import styles from "./KnowledgeTree.module.css";

interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
  collapseAll: () => void;
}

/**
 * 知识树组件
 * 实现按需加载功能：
 * 1. 首次加载时仅渲染Domain和subDomain层级数据
 * 2. 当用户点击展开subDomain节点时，动态加载该节点下的分类及知识点数据
 */
const KnowledgeTree = forwardRef<KnowledgeTreeRef>((_, ref) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<KnowledgeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [entityMap, setEntityMap] = useState<Map<string, Entity>>(new Map());
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // 加载初始数据 - 仅加载Domain和subDomain层级
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // 只获取一级和二级分类数据
      const domainSubDomainData = await getDomainSubDomainData();
      const entitiesData = await fetchEntities();

      // 创建实体映射
      const entityMap = new Map<string, Entity>();
      entitiesData.forEach((entity) => {
        entityMap.set(entity.entity_id, entity);
      });
      setEntityMap(entityMap);

      // 自定义domain排序函数：将"通信"置顶，其他按照预设顺序排序
      const sortDomains = (
        domains: Array<{ domain: string; subDomains: string[] }>
      ): Array<{ domain: string; subDomains: string[] }> => {
        // 定义预设排序规则
        const domainPriority = {
          通信: 1, // 最高优先级
          数学: 3,
          计算机: 2,
          自然科学: 4,
          电路与电子: 5,
          // 可以根据需要添加更多domain的优先级
        };

        return [...domains].sort((a, b) => {
          // 检查是否有"通信"domain，确保它总是排在最前面
          if (a.domain === "通信") return -1;
          if (b.domain === "通信") return 1;

          // 根据预设优先级排序
          const priorityA =
            (domainPriority as Record<string, number>)[a.domain] || 999; // 未指定优先级的放在最后
          const priorityB =
            (domainPriority as Record<string, number>)[b.domain] || 999;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // 如果优先级相同，按名称字母顺序排序
          return a.domain.localeCompare(b.domain);
        });
      };

      // 对domain数据进行排序
      const sortedDomainData = sortDomains(domainSubDomainData);

      // 转换为树形结构（仅一级和二级节点，标记为可懒加载）
      const tree = convertToTreeStructure(sortedDomainData);
      setTreeData(tree);

      // 默认展开第一级（Domain层级）
      const firstLevelKeys = tree.map((node) => node.key);
      setExpandedKeys(firstLevelKeys);
    } catch (error) {
      console.error("加载数据失败:", error);
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载初始数据
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 转换数据为树形结构（支持懒加载）
  const convertToTreeStructure = (
    domainSubDomainData: Array<{ domain: string; subDomains: string[] }>
  ): KnowledgeNode[] => {
    return domainSubDomainData.map((item) => ({
      title: item.domain,
      key: item.domain,
      isLeaf: false,
      children: item.subDomains.map((subDomain) => ({
        title: subDomain,
        key: `${item.domain}/${subDomain}`,
        isLeaf: false, // 标记为非叶子节点，可懒加载
        children: undefined,
      })),
    }));
  };

  // 删除不再需要的buildPathTree函数，因为后端直接返回树形结构

  // 加载子节点数据
  const onLoadData = async (nodeData: any): Promise<void> => {
    try {
      // 检查nodeData是否存在
      if (!nodeData) {
        console.error("无效的节点数据:", nodeData);
        return;
      }

      // 直接从节点数据获取key值
      const key = nodeData.key;

      if (!key) {
        console.error("节点缺少key值:", nodeData);
        return;
      }

      // 从key中提取domain和subDomain信息
      const keyParts = key.split("/");
      const domain = keyParts[0];
      const subDomain = keyParts.length > 1 ? keyParts[1] : undefined;

      // 判断是否为二级节点（subDomain节点）
      if (subDomain) {
        // 对于二级节点，直接获取后端返回的树形结构数据
        const treeNodes = await getEntitiesBySubDomain(domain, subDomain);

        // 更新实体映射，确保能通过entity_id找到对应的实体
        const updateEntityMap = (nodes: KnowledgeNode[]) => {
          nodes.forEach((node) => {
            if (node.entity_id) {
              // 由于后端没有直接返回完整的entity对象，这里创建一个简化的entity对象
              // 实际项目中可能需要额外调用API获取完整的entity数据
              const entity: Entity = {
                entity_id: node.entity_id.toString(),
                entity_name: node.title,
                description: "", // 可以通过额外API获取
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: "active",
              };
              setEntityMap((prevMap) =>
                new Map(prevMap).set(node.entity_id.toString(), entity)
              );
            }

            // 递归处理子节点
            if (node.children && node.children.length > 0) {
              updateEntityMap(node.children);
            }
          });
        };

        updateEntityMap(treeNodes);

        // 更新树数据
        const newTreeData = [...treeData];
        updateTreeData(newTreeData, key, treeNodes);
        setTreeData(newTreeData);
      }
    } catch (error) {
      console.error("加载子节点数据失败:", error);
      message.error("加载知识点数据失败，请稍后重试");
    }
  };

  // 递归更新树数据
  const updateTreeData = (
    nodes: KnowledgeNode[],
    targetKey: string,
    newChildren: KnowledgeNode[]
  ): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.key === targetKey) {
        nodes[i] = { ...node, children: newChildren };
        return true;
      }
      if (node.children) {
        const found = updateTreeData(node.children, targetKey, newChildren);
        if (found) return true;
      }
    }
    return false;
  };

  // 将自定义树节点转换为Ant Design树节点
  const convertToAntdTreeData = (nodes: KnowledgeNode[]): any[] => {
    return nodes.map((node) => {
      // 为每个节点生成唯一key，结合路径和entity_id，解决重复key问题
      const nodeKey =
        node.isLeaf && node.entity_id
          ? `${node.key}_${node.entity_id}`
          : node.key;

      const antdNode: any = {
        title: node.title,
        key: nodeKey,
        icon: node.isLeaf ? <FileOutlined /> : <FolderOutlined />,
        children:
          node.children && node.children.length > 0
            ? convertToAntdTreeData(node.children)
            : undefined,
        isLeaf: node.isLeaf,
      };

      return antdNode;
    });
  };

  // 自定义标题渲染函数，实现点击文字触发展开/折叠功能
  const titleRender = (nodeData: any) => {
    // 对于叶子节点，只显示文本，不添加点击事件
    if (nodeData.isLeaf) {
      return <span>{nodeData.title}</span>;
    }

    // 对于非叶节点，添加点击事件来触发展开/折叠
    const handleTitleClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止事件冒泡到树节点默认的选择事件
      const isExpanded = expandedKeys.includes(nodeData.key);

      // 切换展开/折叠状态
      if (isExpanded) {
        // 收起节点
        setExpandedKeys(expandedKeys.filter((key) => key !== nodeData.key));
      } else {
        // 展开节点
        setExpandedKeys([...expandedKeys, nodeData.key]);
      }
    };

    return (
      <span onClick={handleTitleClick} className={styles.clickableTitle}>
        {nodeData.title}
      </span>
    );
  };

  // 处理节点展开
  const onExpand = async (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);

    // 检查是否有新展开的节点
    const newExpandedKeys = expandedKeys.filter(
      (key) => !expandedKeys.includes(key)
    );
    if (newExpandedKeys.length > 0) {
      // 这里可以实现按需加载逻辑
      // 目前为了演示，我们保持现有逻辑
      console.log("展开节点:", newExpandedKeys);
    }

    // 调整滚动区域以适应内容高度变化
    adjustScrollArea();
  };

  // 调整滚动区域以适应内容高度变化
  const adjustScrollArea = () => {
    if (treeContainerRef.current) {
      const scrollContainer = treeContainerRef.current.querySelector(
        `.${styles.scrollContainer}`
      ) as HTMLElement;
      if (scrollContainer) {
        // 强制重新计算滚动区域高度
        scrollContainer.style.height = "0px";
        setTimeout(() => {
          scrollContainer.style.height = "100%";
        }, 10);
      }
    }
  };

  // 处理节点选择
  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const nodeKey = selectedKeys[0] as string;

      // 查找对应的实体
      const entity = findEntityByNodeKey(nodeKey);
      if (entity) {
        handleEntityClick(entity);
      }
    }
  };

  // 查找实体
  const findEntityByNodeKey = (key: string): Entity | null => {
    // 从新格式的key中提取entity_id（格式为"path_entity_id"）
    const parts = key.split("_");
    if (parts.length > 1) {
      const entityId = parts[parts.length - 1];
      return entityMap.get(entityId) || null;
    }
    // 如果是旧格式或非叶子节点，直接使用key查找
    return entityMap.get(key) || null;
  };

  // 处理实体点击
  const handleEntityClick = (entity: Entity) => {
    setSelectedEntity(entity);
    setDetailModalVisible(true);
  };

  // 全部折叠方法
  const collapseAll = useCallback(() => {
    // 清空expandedKeys，只保留第一级节点（Domain层级）
    const firstLevelKeys = treeData.map((node) => {
      const nodeKey =
        node.isLeaf && node.entity_id
          ? `${node.key}_${node.entity_id}`
          : node.key;
      return nodeKey;
    });
    setExpandedKeys(firstLevelKeys);
    setAutoExpandParent(false);
    // 调整滚动区域
    adjustScrollArea();
    message.success("已全部折叠");
  }, [treeData]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    handleEntityClick,
    collapseAll,
  }));

  return (
    <div
      ref={treeContainerRef}
      className={styles.treeContainer}
      style={{
        width: "100%", // 使用100%宽度，完全填充父容器
        maxWidth: "100%", // 确保不超过父容器宽度
        boxSizing: "border-box", // 确保边框和内边距包含在宽度内
        padding: "12px",
        borderRadius: "6px",
      }}
    >
      <Card
        className={styles.treeCard}
        style={{
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        }}
        extra={
          <Button
            type="default"
            size="small"
            onClick={collapseAll}
            className={styles.collapseButton}
          >
            全部折叠
          </Button>
        }
      >
        <div className={`${styles.scrollContainer} ${styles.smoothScroll}`}>
          <Spin spinning={loading}>
            {treeData.length > 0 ? (
              <div className={styles.treeWrapper}>
                <Tree
                  showLine={{ showLeafIcon: false }}
                  treeData={convertToAntdTreeData(treeData)}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  titleRender={titleRender}
                  loadData={onLoadData}
                />
              </div>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Spin>
        </div>
      </Card>

      <EntityDetailModal
        visible={detailModalVisible}
        entity={selectedEntity}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
});

KnowledgeTree.displayName = "KnowledgeTree";
export default KnowledgeTree;

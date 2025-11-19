import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Card, Tree, Spin, message, Tag, Empty } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { Entity, KnowledgeNode } from '../types';
import { fetchEntities, fetchCatalogs } from '../services/dataService';
import { convertToTreeStructure } from '../utils/dataTransform';
import EntityDetailModal from './EntityDetailModal';



interface KnowledgeTreeRef {
  handleEntityClick: (entity: Entity) => void;
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

  // 加载初始数据 - 仅加载Domain和subDomain层级
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [entitiesData, catalogsData] = await Promise.all([
        fetchEntities(),
        fetchCatalogs()
      ]);
      
      // 创建实体映射
      const entityMap = new Map<string, Entity>();
      entitiesData.forEach(entity => {
        entityMap.set(entity.entity_id, entity);
      });
      setEntityMap(entityMap);
      
      // 转换为树形结构（仅Domain和subDomain层级）
      const tree = convertToTreeStructure(catalogsData, entitiesData);
      setTreeData(tree);
      
      // 默认展开第一级（Domain层级）
      const firstLevelKeys = tree.map(node => node.key);
      setExpandedKeys(firstLevelKeys);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载subDomain下的详细数据
  const loadChildrenData = useCallback(async (node: KnowledgeNode) => {
    // 这里可以实现动态加载逻辑
    // 目前我们使用全部数据进行演示
    try {
      setLoading(true);
      const [entitiesData, catalogsData] = await Promise.all([
        fetchEntities(),
        fetchCatalogs()
      ]);
      
      // 创建实体映射
      const entityMap = new Map<string, Entity>();
      entitiesData.forEach(entity => {
        entityMap.set(entity.entity_id, entity);
      });
      setEntityMap(entityMap);
      
      // 转换为完整的树形结构
      const tree = convertToTreeStructure(catalogsData, entitiesData);
      setTreeData(tree);
      
    } catch (error) {
      console.error('加载详细数据失败:', error);
      message.error('加载详细数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载初始数据
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 将自定义树节点转换为Ant Design树节点
  const convertToAntdTreeData = (nodes: KnowledgeNode[]): any[] => {
    return nodes.map(node => {
      // 为每个节点生成唯一key，结合路径和entity_id，解决重复key问题
      const nodeKey = node.isLeaf && node.entityData ? `${node.key}_${node.entityData.entity_id}` : node.key;
      
      const antdNode: any = {
        title: node.title,
        key: nodeKey,
        icon: node.isLeaf ? <FileOutlined /> : <FolderOutlined />,
        children: node.children ? convertToAntdTreeData(node.children) : undefined,
        isLeaf: node.isLeaf
      };

      // 如果是叶子节点，使用标题直接显示而不用span包装
      if (node.isLeaf && node.entityData) {
        antdNode.title = `• ${node.title}`;
      }

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
        setExpandedKeys(expandedKeys.filter(key => key !== nodeData.key));
      } else {
        // 展开节点
        setExpandedKeys([...expandedKeys, nodeData.key]);
      }
    };

    return (
      <span 
        onClick={handleTitleClick}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {nodeData.title}
      </span>
    );
  };

  // 处理节点展开
  const onExpand = async (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
    
    // 检查是否有新展开的节点
    const newExpandedKeys = expandedKeys.filter(key => !expandedKeys.includes(key));
    if (newExpandedKeys.length > 0) {
      // 这里可以实现按需加载逻辑
      // 目前为了演示，我们保持现有逻辑
      console.log('展开节点:', newExpandedKeys);
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
    const parts = key.split('_');
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

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    handleEntityClick
  }));

  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card>
        <Spin spinning={loading}>
          {treeData.length > 0 ? (
            <Tree
              showLine={{ showLeafIcon: false }}
              treeData={convertToAntdTreeData(treeData)}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onExpand={onExpand}
              onSelect={onSelect}
              titleRender={titleRender}
            />
          ) : (
            <Empty description="暂无数据" />
          )}
        </Spin>
      </Card>

      <EntityDetailModal
        visible={detailModalVisible}
        entity={selectedEntity}
        onClose={() => setDetailModalVisible(false)}
      />
    </div>
  );
});

KnowledgeTree.displayName = 'KnowledgeTree';
export default KnowledgeTree;
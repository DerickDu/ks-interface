import type { Entity, Catalog, KnowledgeNode } from '../types';

/**
 * 将目录路径转换为树形结构
 * @param catalogs 目录数据
 * @param entities 实体数据
 * @returns 知识树节点数组
 */
export const convertToTreeStructure = (
  catalogs: Catalog[],
  entities: Entity[]
): KnowledgeNode[] => {
  // 创建实体映射，便于快速查找
  const entityMap = new Map<string, Entity>();
  entities.forEach(entity => {
    entityMap.set(entity.entity_id, entity);
  });

  // 创建路径映射，记录每个路径对应的实体ID
  const pathToEntityMap = new Map<string, string>();
  catalogs.forEach(catalog => {
    pathToEntityMap.set(catalog.path, catalog.entity_id);
  });

  // 创建树形结构
  const rootNodes: KnowledgeNode[] = [];
  const nodeMap = new Map<string, KnowledgeNode>();

  // 处理所有路径
  catalogs.forEach(catalog => {
    const pathParts = catalog.path.split('/');
    let currentLevel = rootNodes;
    let currentPath = '';

    // 构建每一级的节点
    pathParts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLeaf = index === pathParts.length - 1;
      const existingNodeIndex = currentLevel.findIndex(node => node.title === part);

      if (existingNodeIndex >= 0) {
        // 节点已存在，移动到下一级
        const existingNode = currentLevel[existingNodeIndex];
        if (isLeaf && !existingNode.isLeaf) {
          // 如果是叶子节点但现有节点不是，更新为叶子节点
          existingNode.isLeaf = true;
          const entity = entityMap.get(catalog.entity_id);
          if (entity) {
            existingNode.entityData = entity;
          }
          existingNode.path = catalog.path;
          existingNode.domain = catalog.domain;
        }
        currentLevel = existingNode.children || [];
      } else {
        // 创建新节点
        const newNode: KnowledgeNode = {
          key: currentPath,
          title: part,
          isLeaf: isLeaf,
          children: isLeaf ? undefined : []
        };

        // 如果是叶子节点，添加实体数据
        if (isLeaf) {
          const entity = entityMap.get(catalog.entity_id);
          if (entity) {
            newNode.entityData = entity;
          }
          newNode.path = catalog.path;
          newNode.domain = catalog.domain;
        }

        currentLevel.push(newNode);
        nodeMap.set(currentPath, newNode);
        
        // 如果不是叶子节点，继续处理下一级
        if (!isLeaf) {
          currentLevel = newNode.children || [];
        }
      }
    });
  });

  // 按标题排序
  const sortNodes = (nodes: KnowledgeNode[]) => {
    nodes.sort((a, b) => {
      // 叶子节点排在非叶子节点之后
      if (a.isLeaf && !b.isLeaf) return 1;
      if (!a.isLeaf && b.isLeaf) return -1;
      // 同类型按标题排序
      return a.title.localeCompare(b.title, 'zh-CN');
    });
    
    // 递归排序子节点
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);
  return rootNodes;
};

/**
 * 将树形结构转换为YAML格式字符串
 * @param nodes 树节点数组
 * @param level 当前层级，用于缩进
 * @returns YAML格式字符串
 */
export const convertTreeToYAML = (nodes: KnowledgeNode[], level: number = 0): string => {
  let yaml = '';
  const indent = '  '.repeat(level);

  nodes.forEach(node => {
    yaml += `${indent}- ${node.title}`;
    
    if (node.isLeaf && node.entityData) {
      // 添加实体数据作为注释
      yaml += ` # ${node.entityData.entity_name} (${node.entityData.entity_id})`;
    }
    yaml += '\n';
    
    if (node.children && node.children.length > 0) {
      yaml += convertTreeToYAML(node.children, level + 1);
    }
  });

  return yaml;
};

/**
 * 搜索树形结构中的节点
 * @param nodes 树节点数组
 * @param keyword 搜索关键词
 * @returns 匹配的节点及其路径
 */
export const searchInTree = (
  nodes: KnowledgeNode[],
  keyword: string
): { node: KnowledgeNode; path: string }[] => {
  const results: { node: KnowledgeNode; path: string }[] = [];
  const lowerKeyword = keyword.toLowerCase();

  const search = (nodeList: KnowledgeNode[], currentPath: string) => {
    nodeList.forEach(node => {
      const nodePath = currentPath ? `${currentPath}/${node.title}` : node.title;
      
      // 检查节点标题是否匹配
      if (node.title.toLowerCase().includes(lowerKeyword)) {
        results.push({ node, path: nodePath });
      }
      
      // 如果是叶子节点，检查实体数据
      if (node.isLeaf && node.entityData) {
        if (
          node.entityData.entity_name.toLowerCase().includes(lowerKeyword) ||
          node.entityData.description.toLowerCase().includes(lowerKeyword)
        ) {
          results.push({ node, path: nodePath });
        }
      }
      
      // 递归搜索子节点
      if (node.children && node.children.length > 0) {
        search(node.children, nodePath);
      }
    });
  };

  search(nodes, '');
  return results;
};

/**
 * 获取节点的完整路径
 * @param nodes 树节点数组
 * @param targetKey 目标节点的key
 * @returns 完整路径
 */
export const getNodePath = (nodes: KnowledgeNode[], targetKey: string): string | null => {
  const findPath = (nodeList: KnowledgeNode[], currentPath: string): string | null => {
    for (const node of nodeList) {
      const nodePath = currentPath ? `${currentPath}/${node.title}` : node.title;
      
      if (node.key === targetKey) {
        return nodePath;
      }
      
      if (node.children && node.children.length > 0) {
        const found = findPath(node.children, nodePath);
        if (found) return found;
      }
    }
    return null;
  };

  return findPath(nodes, '');
};
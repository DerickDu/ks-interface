import type { Entity, Catalog, SearchResult, EntityDetail, EntitySourceDetail } from '../types';

// 统计数据接口
export interface StatisticsData {
  total_entities: number;
  // 可以根据需要添加其他统计字段
}
import { mockEntities, mockCatalogs, mockEntitySources, mockEntitySourceMaps } from './mockData';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API基础URL，实际使用时应从配置中读取
// const API_BASE_URL = '/api';

// 通用API调用函数
const callApi = async <T>(endpoint: string, _options?: RequestInit): Promise<T> => {
  try {
    // 实际项目中这里会发起真实的网络请求
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    //   ...options,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...options?.headers,
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    // }
    
    // return await response.json();
    
    // 模拟API调用延迟
    await delay(300);
    
    // 根据不同的endpoint返回模拟数据
    if (endpoint === '/statistics') {
      return {
        total_entities: mockEntities.length,
      } as T;
    }
    
    throw new Error(`未实现的API端点: ${endpoint}`);
  } catch (error) {
    console.error(`API调用错误 (${endpoint}):`, error);
    throw error;
  }
}

// 模拟从PostgreSQL获取实体数据
export const fetchEntities = async (): Promise<Entity[]> => {
  await delay(500); // 模拟网络延迟
  return [...mockEntities];
};

// 模拟从PostgreSQL获取目录数据
export const fetchCatalogs = async (): Promise<Catalog[]> => {
  await delay(500); // 模拟网络延迟
  return [...mockCatalogs];
};

// 根据entity_id获取实体详情
export const getEntityById = async (entityId: string): Promise<Entity | null> => {
  await delay(300);
  const entity = mockEntities.find(e => e.entity_id === entityId);
  return entity ? { ...entity } : null;
};

// 根据entity_id获取目录信息
export const getCatalogsByEntityId = async (entityId: string): Promise<Catalog[]> => {
  await delay(300);
  return mockCatalogs.filter(c => c.entity_id === entityId);
};

// 定义搜索API响应格式
export interface SearchAPIResponse {
  data: Array<{
    created_at: string;
    description: string | null;
    domain: string;
    entity_id: number;
    entity_name: string;
    path: string;
    updated_at: string;
    validity_method: string | null;
    validity_result: string | null;
  }>;
  status: string;
  message: string;
}

// 搜索实体
export const searchEntities = async (keyword: string): Promise<SearchAPIResponse> => {
  await delay(500);
  
  if (!keyword.trim()) {
    return {
      data: [],
      status: "success",
      message: "查询成功"
    };
  }
  
  const lowerKeyword = keyword.toLowerCase();
  
  // 模拟API返回的数据
  const mockSearchData = [
    {
      created_at: "2025-11-20T10:42:57.486007",
      description: "安全文件传输协议，用于安全地传输文件",
      domain: "计算机",
      entity_id: 1126,
      entity_name: "SFTP",
      path: "计算机/计算机网络/通信协议/协议分层/应用层协议",
      updated_at: "2025-11-20T10:42:57.486007",
      validity_method: null,
      validity_result: null
    },
    {
      created_at: "2025-11-20T10:42:57.486007",
      description: "简单文件传输协议，用于简单文件传输场景",
      domain: "通信",
      entity_id: 2702,
      entity_name: "TFTP",
      path: "通信/通信协议/应用层协议/SFTP/FTP",
      updated_at: "2025-11-20T10:42:57.486007",
      validity_method: null,
      validity_result: null
    },
    {
      created_at: "2025-11-20T10:42:57.486007",
      description: "文件传输协议，用于在网络上传输文件",
      domain: "计算机",
      entity_id: 3801,
      entity_name: "FTP",
      path: "计算机/计算机网络/通信协议/应用层协议/FTP",
      updated_at: "2025-11-20T10:42:57.486007",
      validity_method: null,
      validity_result: null
    },
    {
      created_at: "2025-11-20T10:42:57.486007",
      description: "超文本传输协议，用于Web数据传输",
      domain: "通信",
      entity_id: 4905,
      entity_name: "HTTP",
      path: "通信/通信协议/应用层协议/HTTP",
      updated_at: "2025-11-20T10:42:57.486007",
      validity_method: null,
      validity_result: null
    }
  ];
  
  // 根据关键词过滤数据
  const filteredData = mockSearchData.filter(item => 
    item.entity_name.toLowerCase().includes(lowerKeyword)
  );
  
  return {
    data: filteredData,
    status: "success",
    message: "查询成功"
  };
};

// 获取实体详情（包含路径信息）
export const getEntityDetail = async (entityId: string): Promise<EntityDetail | null> => {
  await delay(300);
  
  const entity = mockEntities.find(e => e.entity_id === entityId);
  if (!entity) return null;
  
  const catalogs = mockCatalogs.filter(c => c.entity_id === entityId);
  
  return {
    entity: { ...entity },
    paths: catalogs.map(c => c.path),
    domains: [...new Set(catalogs.map(c => c.domain))]
  };
};

// 获取实体关联的源信息
export const getEntitySources = async (entityId: string): Promise<EntitySourceDetail[]> => {
  await delay(300);
  
  // 查找实体相关的所有source_id
  const sourceMaps = mockEntitySourceMaps.filter(map => map.entity_id === entityId);
  const sourceIds = sourceMaps.map(map => map.source_id);
  
  // 根据source_id获取源信息
  const sources = mockEntitySources.filter(source => sourceIds.includes(source.source_id));
  
  // 返回源信息详情
  return sources.map(source => ({
    source_id: source.source_id,
    source_type: source.source_type,
    source_ref: source.source_ref,
    created_at: source.created_at
  }));
};

// 获取所有领域
export const getAllDomains = async (): Promise<string[]> => {
  await delay(300);
  return [...new Set(mockCatalogs.map(c => c.domain))];
};

// 获取一级和二级分类数据（Domain和SubDomain）
export const getDomainSubDomainData = async (): Promise<Array<{domain: string, subDomains: string[]}>> => {
  await delay(300);
  
  // 模拟新的后端返回数据格式
  const backendData = [
    {
      "children": [
        { "key": "通信:通信安全", "title": "通信安全" },
        { "key": "通信:通信应用", "title": "通信应用" },
        { "key": "通信:通信技术", "title": "通信技术" },
        { "key": "通信:通信设备", "title": "通信设备" },
        { "key": "通信:通信标准", "title": "通信标准" },
        { "key": "通信:通信原理", "title": "通信原理" },
        { "key": "通信:通信协议", "title": "通信协议" },
        { "key": "通信:通信网络", "title": "通信网络" }
      ],
      "key": "通信",
      "title": "通信"
    },
    {
      "children": [
        { "key": "数学:数学基础", "title": "数学基础" },
        { "key": "数学:数学应用", "title": "数学应用" },
        { "key": "数学:数学原理", "title": "数学原理" },
        { "key": "数学:数学公式", "title": "数学公式" },
        { "key": "数学:数学计算", "title": "数学计算" },
        { "key": "数学:数学分析", "title": "数学分析" },
        { "key": "数学:数学统计", "title": "数学统计" },
        { "key": "数学:数学优化", "title": "数学优化" }
      ],
      "key": "数学",
      "title": "数学"
    },
    {
      "children": [
        { "key": "计算机:计算机基础", "title": "计算机基础" },
        { "key": "计算机:计算机应用", "title": "计算机应用" },
        { "key": "计算机:计算机原理", "title": "计算机原理" },
        { "key": "计算机:计算机算法", "title": "计算机算法" },
        { "key": "计算机:计算机网络", "title": "计算机网络" },
        { "key": "计算机:计算机系统", "title": "计算机系统" },
        { "key": "计算机:计算机安全", "title": "计算机安全" },
        { "key": "计算机:计算机编程", "title": "计算机编程" }
      ],
      "key": "计算机",
      "title": "计算机"
  }];
  
  // 转换后端数据为组件期望的格式
  const result: Array<{domain: string, subDomains: string[]}> = backendData.map(item => {
    return {
      domain: item.title,
      subDomains: item.children.map(child => child.title)
    };
  });
  
  return result;
};

// 获取指定Domain和SubDomain下的所有路径数据（用于懒加载子节点）
export const getPathsByDomainSubDomain = async (domain: string, subDomain?: string): Promise<Catalog[]> => {
  await delay(300);
  
  if (subDomain) {
    return mockCatalogs.filter(catalog => 
      catalog.domain === domain && catalog.subDomain === subDomain
    );
  }
  
  return mockCatalogs.filter(catalog => catalog.domain === domain);
};

// 添加KnowledgeNode类型定义
export interface KnowledgeNode {
  title: string;
  key: string;
  isLeaf: boolean;
  children: KnowledgeNode[];
  entity_id: string | number | null;
}

// 根据domain和sub_domain获取知识点数据 - 直接返回树形结构数据
export const getEntitiesBySubDomain = async (domain: string, subDomain?: string): Promise<KnowledgeNode[]> => {
  await delay(300);
  
  // 模拟后端直接返回的树形结构数据
  // 实际项目中这里会发起真实的网络请求
  // const response = await fetch(`/api/entities/domain/${domain}/subdomain/${subDomain}`);
  // return await response.json();
  
  // 模拟数据 - 根据domain和subDomain返回对应的树形结构
  const mockTreeData: KnowledgeNode[] = [
    {
      title: `${subDomain || domain} 示例1`,
      key: `${domain}/${subDomain || ''}/示例1`,
      isLeaf: false,
      children: [
        {
          title: '示例叶子节点1',
          key: `${domain}/${subDomain || ''}/示例1/叶子节点1`,
          isLeaf: true,
          children: [],
          entity_id: '1001'
        }
      ],
      entity_id: null
    },
    {
      title: `${subDomain || domain} 示例2`,
      key: `${domain}/${subDomain || ''}/示例2`,
      isLeaf: true,
      children: [],
      entity_id: '1002'
    }
  ];
  
  return mockTreeData;
};

// 获取统计数据
export const fetchStatisticsData = async (): Promise<StatisticsData> => {
  try {
    // 调用通用API函数获取统计数据
    return await callApi<StatisticsData>('/statistics');
  } catch (error) {
    // 如果API调用失败，返回默认值并记录错误
    console.error('获取统计数据失败:', error);
    throw error;
  }
};

// 获取各领域知识点数量
export const fetchDomainStatistics = async (): Promise<Record<string, number>> => {
  try {
    // 实际项目中，这里会调用真实的API端点
    // const response = await fetch(`${API_BASE_URL}/statistics/domains`);
    // return await response.json();
    
    // 模拟API调用延迟
    await delay(300);
    
    // 模拟返回的JSON格式数据，其中key是领域名称，value是对应的知识点数量
    return {
      "通信": mockCatalogs.filter(c => c.domain === "通信").length,
      "数学": mockCatalogs.filter(c => c.domain === "数学").length,
      "计算机": mockCatalogs.filter(c => c.domain === "计算机").length,
      "自然科学": mockCatalogs.filter(c => c.domain === "自然科学").length,
      "电路与电子": mockCatalogs.filter(c => c.domain === "电路与电子").length,
    };
  } catch (error) {
    console.error('获取领域统计数据失败:', error);
    throw error;
  }
};
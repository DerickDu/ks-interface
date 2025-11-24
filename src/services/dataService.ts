import type { Entity, Catalog, SearchResult, EntityDetail, EntitySourceDetail } from '../types';
import { mockEntities, mockCatalogs, mockEntitySources, mockEntitySourceMaps } from './mockData';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// 搜索实体
export const searchEntities = async (keyword: string): Promise<SearchResult[]> => {
  await delay(500);
  
  if (!keyword.trim()) return [];
  
  const lowerKeyword = keyword.toLowerCase();
  const matchedEntities = mockEntities.filter(entity => 
    entity.entity_name.toLowerCase().includes(lowerKeyword) ||
    entity.description.toLowerCase().includes(lowerKeyword)
  );
  
  const results: SearchResult[] = matchedEntities.map(entity => {
    const catalogs = mockCatalogs.filter(c => c.entity_id === entity.entity_id);
    return {
      entity: { ...entity },
      paths: catalogs.map(c => c.path),
      domains: [...new Set(catalogs.map(c => c.domain))]
    };
  });
  
  return results;
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
  
  // 创建一个Map来存储domain到subDomains的映射
  const domainToSubDomains = new Map<string, Set<string>>();
  
  // 遍历所有catalog，提取不重复的domain和subDomain组合
  mockCatalogs.forEach(catalog => {
    if (!domainToSubDomains.has(catalog.domain)) {
      domainToSubDomains.set(catalog.domain, new Set<string>());
    }
    // 添加非空检查，确保只有字符串类型才能添加到Set中
    if (catalog.subDomain !== undefined) {
      domainToSubDomains.get(catalog.domain)!.add(catalog.subDomain);
    }
  });
  
  // 转换为所需的数组格式
  const result: Array<{domain: string, subDomains: string[]}> = [];
  domainToSubDomains.forEach((subDomains, domain) => {
    result.push({
      domain,
      subDomains: Array.from(subDomains)
    });
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

// 根据sub_domain获取知识点数据
export const getEntitiesBySubDomain = async (subDomain: string): Promise<{catalogs: Catalog[], entities: Entity[]}> => {
  await delay(300);
  
  // 1. 首先根据subDomain筛选目录数据
  const filteredCatalogs = mockCatalogs.filter(catalog => catalog.subDomain === subDomain);
  
  // 2. 提取相关的entity_id列表
  const entityIds = [...new Set(filteredCatalogs.map(catalog => catalog.entity_id))];
  
  // 3. 根据entity_id获取对应的实体数据
  const filteredEntities = mockEntities.filter(entity => entityIds.includes(entity.entity_id));
  
  return {
    catalogs: filteredCatalogs,
    entities: filteredEntities
  };
};
// 实体表数据模型
export interface Entity {
  entity_id: string;
  entity_name: string;
  description: string;
  validity_result: string;
  validity_method: string;
  created_at: string;
  updated_at: string;
}

// 目录表数据模型
export interface Catalog {
  entity_id: string;
  path: string;
  domain: string;
  subDomain?: string;
}

// 知识体系树节点模型
export interface KnowledgeNode {
  key: string;
  title: string;
  isLeaf?: boolean;
  children?: KnowledgeNode[];
  entityData?: Entity;
  path?: string;
  domain?: string;
}

// 搜索结果模型
export interface SearchResult {
  entity: Entity;
  paths: string[];
  domains: string[];
}

// 知识点详情模型
export interface EntityDetail {
  entity: Entity;
  paths: string[];
  domains: string[];
}

// 实体源映射表数据模型 (Entities Source Map)
export interface EntitySourceMap {
  source_id: string;
  entity_id: string;
}

// 实体源信息表数据模型 (Entities Source)
export interface EntitySource {
  source_id: string;
  source_type: string;
  source_ref: string;
  created_at: string;
}

// 实体源信息详情模型
export interface EntitySourceDetail {
  source_id: string;
  source_type: string;
  source_ref: string;
  created_at: string;
}
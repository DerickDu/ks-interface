# 知识体系管理界面 (ks-interface)

这是一个用于管理和展示知识体系结构的前端界面，基于React、TypeScript和Ant Design开发。

## 功能特性

### 知识树展示
- 支持多层级知识体系展示
- 实现Domain -> subDomain -> 知识点的三级结构
- 按需加载机制，提升大数据量下的性能表现

### 数据统计面板
- 提供多种维度的数据统计视图
- 响应式布局设计，适配不同屏幕尺寸
- 紧凑型UI设计，最大化信息密度

### 搜索功能
- 支持关键字搜索
- 实时过滤显示匹配结果

## 技术架构

### 前端技术栈
- React 18.x
- TypeScript
- Ant Design 组件库
- Vite 构建工具

### 数据结构设计

#### Catalog 表结构扩展
新增了 `subDomain` 字段用于存储知识体系的第二层节点数据：

```typescript
interface Catalog {
  entity_id: string;
  path: string;
  domain: string;
  subDomain?: string; // 新增字段
}
```

### 按需加载实现
1. 首次加载时仅渲染 Domain 和 subDomain 层级数据
2. 当用户展开 subDomain 节点时，动态加载该节点下的分类及知识点数据
3. 通过优化的数据转换算法提升渲染性能

## 开发指南

### 环境准备
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 目录结构
```
src/
├── components/          # React组件
│   ├── KnowledgeTree.tsx # 知识树组件
│   └── MainLayout.tsx    # 主布局组件
├── services/            # 数据服务
│   ├── dataService.ts   # 数据接口
│   └── mockData.ts      # 模拟数据
├── types/               # TypeScript类型定义
│   └── index.ts
└── utils/               # 工具函数
    └── dataTransform.ts # 数据转换工具
```

## 更新日志

### v1.1.0
- 在 PostgreSQL 数据库的 catalog 表中新增 subDomain 字段
- 优化知识树组件，实现按需加载功能
- 改进数据统计面板的响应式布局
- 更新数据结构以支持二级知识节点

### v1.0.0
- 初始版本发布
- 实现基础的知识树展示功能
- 提供数据统计面板
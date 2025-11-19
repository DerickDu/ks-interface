# 知识体系管理界面 (ks-interface)

这是一个用于管理和展示知识体系结构的前端界面，基于React、TypeScript和Ant Design开发。

## 功能特性

### 知识树展示
- 支持多层级知识体系展示
- 实现Domain -> subDomain -> 知识点的三级结构
- 按需加载机制，提升大数据量下的性能表现
- 树容器宽度自适应功能，优化不同屏幕尺寸下的显示效果

### 数据统计面板
- 提供多种维度的数据统计视图
- 响应式布局设计，适配不同屏幕尺寸
- 紧凑型UI设计，最大化信息密度
- 支持按领域、来源类型等多维度数据展示

### 搜索功能
- 支持关键字搜索
- 实时过滤显示匹配结果
- 搜索结果高亮显示

### 组件样式优化
- 采用CSS模块化方案，提高样式可维护性
- 移除内联样式，统一使用外部CSS文件
- 响应式设计，支持多种设备访问

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
│   ├── CopyNotification.tsx # 复制通知组件
│   ├── EntityDetailModal.tsx # 实体详情模态框
│   ├── Footer.tsx       # 页脚组件
│   ├── Header.tsx       # 页头组件
│   ├── KnowledgeTree.tsx # 知识树组件
│   ├── MainLayout.tsx   # 主布局组件
│   └── SearchComponent.tsx # 搜索组件
├── hooks/               # 自定义React钩子
├── services/            # 数据服务
│   ├── dataService.ts   # 数据接口
│   └── mockData.ts      # 模拟数据
├── types/               # TypeScript类型定义
│   └── index.ts
└── utils/               # 工具函数
    └── dataTransform.ts # 数据转换工具
```

## 更新日志

### v1.2.0 (最新更新)

#### 修改概述
本次更新主要针对UI组件样式优化、响应式布局改进以及代码质量提升，移除了所有内联样式，采用CSS模块化方案，提高了代码可维护性和性能。

#### 详细变更列表

**样式系统重构**
- 移除所有组件中的内联样式，统一采用CSS模块化方案
- 为所有组件添加对应的.module.css文件，实现样式隔离
- 优化搜索组件样式，提升用户交互体验
- 实现响应式设计，支持多种设备访问

**Header组件优化**
- 重构搜索框样式，移除内联style属性
- 优化搜索按钮交互效果，添加悬停和点击动画
- 改进响应式布局，适配不同屏幕尺寸
- 修复样式冲突问题，确保组件样式一致性

**MainLayout组件增强**
- 重构数据统计面板布局，实现响应式设计
- 优化卡片组件样式，提高信息展示密度
- 改进移动端适配，确保小屏幕设备上的可用性
- 修复布局错位问题，提升整体视觉效果

**KnowledgeTree组件改进**
- 优化树形结构样式，提高可读性
- 实现树容器宽度自适应功能
- 改进节点展开/折叠动画效果
- 优化大数据量下的渲染性能

**新增组件样式文件**
- 新增CopyNotification.module.css
- 新增EntityDetailModal.module.css
- 新增Footer.module.css
- 新增Header.module.css
- 新增KnowledgeTree.module.css

#### 影响范围
- 所有UI组件的样式系统
- 响应式布局表现
- 移动端适配效果
- 组件间样式隔离

#### 使用指南
- 开发者在自定义组件样式时，请遵循CSS模块化规范
- 新增样式应添加到对应的.module.css文件中
- 避免使用内联样式，保持代码一致性
- 响应式设计应使用媒体查询实现

#### 兼容性说明
- 本次更新完全向后兼容，不影响现有功能
- 样式系统重构不会影响API接口
- 建议在更新后进行全面UI测试，确保视觉效果符合预期
- 如有自定义样式，请迁移至对应的CSS模块文件中

### v1.1.0
- 在 PostgreSQL 数据库的 catalog 表中新增 subDomain 字段
- 优化知识树组件，实现按需加载功能
- 改进数据统计面板的响应式布局
- 更新数据结构以支持二级知识节点
- 添加树容器宽度自适应功能
- 重构统计面板布局并添加响应式设计

### v1.0.0
- 初始版本发布
- 实现基础的知识树展示功能
- 提供数据统计面板
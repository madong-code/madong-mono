# meta.module 模板机制测试指南

## 概述

本测试实现了后端菜单通过 `meta.module` 字段加载对应模板页面的能力。支持多种 Component 路径格式。

## 实现的功能

### 1. 后端 Mock 接口

#### `GET /api/menu/all`
获取用户所有菜单（支持包含插件菜单）

**查询参数:**
- `includePlugins`: boolean - 是否包含插件菜单（默认 false）

#### `GET /api/plugin/menus`
获取插件菜单（专门用于测试）

**查询参数:**
- `format`: 'full' | 'component' | 'meta' - 返回格式
  - `full`: 完整菜单结构（默认）
  - `component`: 只返回 component 字段列表
  - `meta`: 只返回 meta.module 信息

### 2. 支持的 Component 格式

| 格式 | 示例 | 说明 |
|------|------|------|
| **plugin/{module}/views/{template}** | `plugin/ask/views/question/list` | 插件完整路径 |
| **{module}:{template}** | `doc:category/list` | 模块简写格式 |
| **template/crud/{template}** | `template/crud/list` | 通用模板格式 |
| **/{path}** | `/dashboard/analytics/index` | 普通路径格式 |

### 3. 插件菜单结构

Mock 数据中包含以下测试模块：

- **Ask 模块** - 问答模块
  - /plugin/ask/question - 问题列表
  - /plugin/ask/category - 分类列表
  - /plugin/ask/tag - 标签列表

- **Doc 模块** - 文档模块
  - /plugin/doc/item - 文档列表
  - /plugin/doc/category - 分类列表
  - /plugin/doc/permission - 权限管理

- **Market 模块** - 市场模块
  - /plugin/market/apps - 应用列表
  - /plugin/market/category - 分类列表

- **Template 演示** - 通用模板测试
  - /plugin/template/crud-list - CRUD 列表模板

- **Demo 插件** - 测试插件
  - /plugin/demo - 演示首页

## 测试步骤

### 1. 启动后端 Mock 服务

```bash
cd apps/backend-mock
npm run dev
```

### 2. 启动前端项目

```bash
cd apps/web-ele
npm run dev
```

### 3. 测试接口

可以使用浏览器或 Postman 测试以下接口：

```bash
# 获取包含插件的完整菜单
GET /api/menu/all?includePlugins=true

# 获取插件菜单 - 完整格式
GET /api/plugin/menus?format=full

# 获取插件菜单 - Component 列表
GET /api/plugin/menus?format=component

# 获取插件菜单 - Meta 信息
GET /api/plugin/menus?format=meta
```

### 4. 前端测试页面

访问: `/plugin-module-test`

这个页面提供了：
- 完整菜单树展示
- Component 格式列表
- Meta.module 详细信息
- 路径解析测试用例

## 核心实现文件

### 后端 Mock
- `apps/backend-mock/utils/mock-data.ts` - 插件菜单模拟数据
- `apps/backend-mock/api/menu/all.ts` - 菜单接口（增强版）
- `apps/backend-mock/api/plugin/menus.ts` - 插件菜单测试接口

### 前端路由解析
- `packages/utils/src/helpers/generate-routes-backend.ts` - 后端路由生成器（增强版）
- `apps/web-ele/src/router/access.ts` - 路由权限控制（增强版）

### 模板页面
- `apps/web-ele/src/views/templates/crud/list.vue` - 通用 CRUD 模板
- `apps/web-ele/src/views/plugin-module-test/index.vue` - 测试页面

## 关键代码解析

### 路径解析函数 (`resolveComponentPath`)

```typescript
function resolveComponentPath(
  component: string,
  meta?: any,
): ComponentResolveResult {
  // 1. template/crud/{template} - 通用模板
  if (component.startsWith('template/')) {
    return { path: `/templates/${templatePath}`, format: 'template', ... };
  }

  // 2. {module}:{template} - 模块简写格式
  if (component.includes(':')) {
    return { path: `/plugins/_plugin-${module}/views/${templatePath}`, format: 'module', ... };
  }

  // 3. plugin/{module}/views/{template} - 插件完整路径
  if (component.startsWith('plugin/')) {
    return { path: `/plugins/_plugin-${module}/views/${template}`, format: 'plugin', ... };
  }

  // 4. 普通路径
  return { path: normalizeViewPath(component), format: 'normal', ... };
}
```

### 路由转换增强

```typescript
function convertRoutes(...) {
  return mapTree(routes, (node) => {
    // ...
    const result = resolveComponentPath(component, route.meta);
    // 解析后路径会自动添加 .vue 后缀并在 pageMap 中查找
    // ...
  });
}
```

## 预期结果

1. ✅ 接口返回正确的菜单数据，包含 `meta.module` 和 `component` 字段
2. ✅ 前端路由解析器能正确识别不同格式的 component
3. ✅ 通用模板页面能正确加载并显示调试信息
4. ✅ 测试页面能展示完整的菜单结构和解析过程

## 注意事项

1. 实际项目中需要创建真实的插件页面才能正常显示
2. 当前实现使用 404 作为组件不存在时的降级方案
3. 插件目录约定为 `src/plugins/_plugin-{moduleName}/`
4. 通用模板目录约定为 `src/views/templates/`

## 后续优化方向

1. 支持更多模板类型（表单、详情页、树形等）
2. 添加动态菜单的缓存策略
3. 支持菜单权限与模块权限的联动
4. 插件热更新支持

# @madong/visual-form

表单设计器 & 渲染器包装包。

本包将其封装为 Vue composable，实现按需懒加载，不影响主包体积。

> **注意**：本模块为 madong框架内置集成，不可脱离当前框架单独使用。如需在框架外独立使用,请前往 [官网](https://www.vform666.com/) 购买授权。

## 安装

```json
// apps/admin/package.json
{
  "dependencies": {
    "@madong/visual-form": "workspace:*"
  }
}
```

依赖已自动包含 `element-plus` 和 `@element-plus/icons-vue`。

## 使用方式

### 1. 表单设计器（Form Builder）

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useVForm } from '@madong/visual-form';

const { isReady, error } = useVForm();

const vfDesignerRef = ref<any>(null);
const formJson = ref({ ...EMPTY_FORM_JSON });
</script>

<template>
  <!-- 加载中 -->
  <div v-if="!isReady && !error">加载设计器...</div>
  <!-- 加载失败 -->
  <div v-else-if="error">{{ error }}</div>
  <!-- 设计器 -->
  <template v-else>
    <v-form-designer
      ref="vfDesignerRef"
      :designer-config="designerConfig"
      :form-json="formJson"
    >
      <template #customToolButtons>
        <ElButton type="primary" link @click="handleSave">保存</ElButton>
      </template>
    </v-form-designer>
  </template>
</template>
```

### 2. 表单渲染器（Form Render）

```vue
<script setup lang="ts">
import { useVForm } from '@madong/visual-form';

const { isReady, error } = useVForm();

const formJson = {
  /* ...表单 schema */
};
const formData = {};
</script>

<template>
  <div v-if="!isReady && !error">加载渲染器中...</div>
  <div v-else-if="error">{{ error }}</div>

  <template v-else>
    <VFormRender
      :form-json="formJson"
      :form-data="formData"
      :option-data="[]"
    />
  </template>
</template>
```

## API

### `useVForm()`

懒加载 composable，返回响应式状态：

| 返回值    | 类型                  | 说明                                  |
| --------- | --------------------- | ------------------------------------- |
| `isReady` | `Ref<boolean>`        | 是否已加载并注册完成                  |
| `error`   | `Ref<string \| null>` | 加载失败时的错误信息，成功时为 `null` |

**注意**：需要在 **组件 `onBeforeMount` 触发前** 调用（即在 `<script setup>` 顶层调用），因为内部使用 `onBeforeMount` 生命周期钩子启动加载。

## 加载机制

UMD 构建产物通过 `new URL(..., import.meta.url)` 动态 `<script>` 标签加载，Vite 原生支持此模式：

- **Dev**: Vite 直接 serve 原始文件
- **Build**: Vite 自动将文件复制到 `dist/` 并重写 URL

加载流程：

1. 注册 Element Plus（设计器内部依赖）
2. 设置 `globalThis.Vue` 和 `globalThis.ElementPlusIconsVue`（UMD 需要）
3. 动态插入 `<script>` 标签加载 `designer.umd.js`
4. 动态插入 `<link>` 标签加载 `designer.style.css`
5. 从 `globalThis.VFormDesigner` 读取模块，注册为 Vue 插件

所有操作仅在调用 `useVForm()` 的页面进入时触发，不影响其他页面性能。

## 全局使用

如果整个应用都需要 VForm3（例如表单设计器和渲染器在多个路由中使用），推荐在框架入口 `bootstrap.ts` 中直接注册，一次加载全局可用。

`useVForm()` 内部使用了 `onBeforeMount` 生命周期，不适合在入口调用。全局使用需要包装一个安装函数，核心逻辑与 `useVForm()` 相同，只是直接接收 `app` 实例：

```ts
// apps/admin/src/bootstrap.ts
import { createApp } from 'vue';
import { setupVForm } from './setup-v-form'; // 全局安装函数

async function bootstrap(namespace: string) {
  const app = createApp(App);

  // ... 其他插件注册 ...

  // 全局注册，所有页面直接使用 <v-form-designer> / <VFormRender>
  await setupVForm(app);

  app.mount('#app');
}
```

> **建议**：全局注册后，各页面无需再调 `useVForm()`，直接使用组件标签即可。缺点是即使页面不需要表单设计器也要加载 VForm3；如需按需加载请使用上一节的页面级 `useVForm()` 方式。

## 文件结构

```
packages/lib/visual-form/
├── designer.umd.js       # UMD 构建产物
├── designer.es.js        # ES Module 构建产物（当前未使用）
├── designer.style.css    # 样式
├── src/
│   ├── index.ts          # 包入口，导出 useVForm
│   └── v-form.ts         # 懒加载 composable 实现
├── package.json
└── README.md
```

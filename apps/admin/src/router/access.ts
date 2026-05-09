import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { ElMessage } from 'element-plus';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';
import pluginRouter from './plugin';

/** 无权限时显示的 403 组件 */
const FORBIDDEN_COMPONENT = () => import('#/views/_core/fallback/forbidden.vue');


/**
 * 打印扫描到的组件模板
 */
function logScannedTemplates(pageMap: ComponentRecordType): void {
  if (!import.meta.env.DEV) return;

  const keys = Object.keys(pageMap);
  console.log(`[generateAccess] 📦 Scanned ${keys.length} components:`);

  // 按目录分类统计
  const categorized: Record<string, string[]> = {};
  keys.forEach((key) => {
    const parts = key.replace('../', '').split('/');
    const category = parts[0] || 'unknown';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(key);
  });

  Object.entries(categorized).forEach(([category, items]) => {
    console.log(`[generateAccess] 📂 ${category}: ${items.length} files`);
  });
}

/**
 * 扫描并构建页面组件映射表
 */
function buildPageMap(): ComponentRecordType {
  const viewsMap = import.meta.glob('../views/**/*.vue', { eager: false });
  const pluginsMap = import.meta.glob('../plugins/**/*.vue', { eager: false });

  const pageMap: ComponentRecordType = {
    ...(viewsMap as ComponentRecordType),
    ...(pluginsMap as ComponentRecordType),
  };

  logScannedTemplates(pageMap);

  return pageMap;
}

/**
 * 从后端获取菜单列表
 */
async function fetchBackendMenus(): Promise<any[]> {
  ElMessage({
    duration: 1500,
    message: `${$t('common.loadingMenu')}...`,
  });

  const backendMenus = await getAllMenusApi();
  
  // 合并插件定义的后端格式路由
  return pluginRouter.mergeBackendMenus(backendMenus);
}

/**
 * 生成路由和菜单（核心方法）
 */
async function generateAccess(options: GenerateMenuAndRoutesOptions): Promise<any> {
  const pageMap = buildPageMap();

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: fetchBackendMenus,
    forbiddenComponent: FORBIDDEN_COMPONENT,
    layoutMap: { BasicLayout, IFrameView },
    pageMap,
  });
}

export { generateAccess, fetchBackendMenus };

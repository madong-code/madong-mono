import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { getPluginMenus } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

/**
 * 插件菜单接口
 * 
 * 用于测试 meta.module 和模板页面加载机制
 * 
 * 查询参数:
 * - format: 'full' | 'component' | 'meta' - 返回格式
 *   - full: 返回完整菜单结构（默认）
 *   - component: 只返回 component 字段列表
 *   - meta: 只返回 meta.module 信息
 */
export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format || 'full';

  const pluginMenus = getPluginMenus();

  if (format === 'component') {
    // 提取所有 component 字段
    const components = extractComponents(pluginMenus);
    return useResponseSuccess(components);
  }

  if (format === 'meta') {
    // 提取所有 meta.module 信息
    const metaInfo = extractMetaModule(pluginMenus);
    return useResponseSuccess(metaInfo);
  }

  // 默认返回完整菜单结构
  return useResponseSuccess(pluginMenus);
});

/**
 * 递归提取所有 component 字段
 */
function extractComponents(menus: any[]): any[] {
  const result: any[] = [];
  menus.forEach((menu) => {
    if (menu.component) {
      result.push({
        name: menu.name,
        path: menu.path,
        component: menu.component,
        module: menu.meta?.module || '',
        template: menu.meta?.template || '',
      });
    }
    if (menu.children && menu.children.length > 0) {
      result.push(...extractComponents(menu.children));
    }
  });
  return result;
}

/**
 * 递归提取所有 meta.module 信息
 */
function extractMetaModule(menus: any[]): any[] {
  const result: any[] = [];
  menus.forEach((menu) => {
    result.push({
      name: menu.name,
      path: menu.path,
      module: menu.meta?.module || '',
      template: menu.meta?.template || '',
      component: menu.component || '',
      meta: menu.meta,
    });
    if (menu.children && menu.children.length > 0) {
      result.push(...extractMetaModule(menu.children));
    }
  });
  return result;
}

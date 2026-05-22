import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENUS, getPluginMenusAsRoutes } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const includePlugins = query.includePlugins !== 'false';

  const baseMenus =
    MOCK_MENUS.find((item) => item.username === userinfo.username)?.menus ?? [];

  // 如果请求包含插件菜单，则合并插件菜单（转换为路由格式后）
  const pluginMenus = includePlugins ? getPluginMenusAsRoutes() : [];
  const menus = [...baseMenus, ...pluginMenus];
  return useResponseSuccess(menus);
});

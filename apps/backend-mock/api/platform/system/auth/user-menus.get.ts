import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENUS, getPluginMenusAsRoutes } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const baseMenus =
    MOCK_MENUS.find((item) => item.username === userinfo.username)?.menus ?? [];
  const pluginMenus = getPluginMenusAsRoutes();
  const menus = [...baseMenus, ...pluginMenus];

  return useResponseSuccess(menus);
});

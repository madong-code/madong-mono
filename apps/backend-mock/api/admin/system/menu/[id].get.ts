import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENU_LIST } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

function findMenuById(menus: any[], id: string): any {
  for (const menu of menus) {
    if (menu.id === Number(id)) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuById(menu.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const params = getRouterParams(event);
  const menu = findMenuById(MOCK_MENU_LIST, params.id);

  return useResponseSuccess(menu || MOCK_MENU_LIST[0]);
});

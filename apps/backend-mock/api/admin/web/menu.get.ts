import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_WEB_MENUS = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 10000}`,
  name: `菜单项${i + 1}`,
  title: `菜单项${i + 1}`,
  path: `/web/menu${i + 1}`,
  icon: 'icon-home',
  sort: i,
  status: i % 2 === 0 ? 1 : 0,
  pid: i < 5 ? '0' : `${10000 + (i % 5)}`,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_WEB_MENUS);
});

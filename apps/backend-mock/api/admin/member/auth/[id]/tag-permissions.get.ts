import { eventHandler, getRouterParam, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_MENUS = [
  {
    id: '1',
    pid: '0',
    name: '会员中心',
    type: 'catalog',
    icon: 'carbon:user',
    path: '/member',
  },
  {
    id: '2',
    pid: '1',
    name: '会员列表',
    type: 'menu',
    icon: 'carbon:list',
    path: '/member/list',
  },
  {
    id: '4',
    pid: '2',
    name: '查看会员',
    type: 'button',
    authCode: 'member:view',
  },
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const format = query.format as string || 'tree';

  return usePageResponseSuccess(1, 100, MOCK_MENUS);
});

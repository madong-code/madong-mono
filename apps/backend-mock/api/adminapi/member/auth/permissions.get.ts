import { eventHandler, getQuery } from 'h3';
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
    id: '3',
    pid: '1',
    name: '会员等级',
    type: 'menu',
    icon: 'carbon:chart-bar',
    path: '/member/level',
  },
  {
    id: '4',
    pid: '2',
    name: '查看会员',
    type: 'button',
    authCode: 'member:view',
  },
  {
    id: '5',
    pid: '2',
    name: '编辑会员',
    type: 'button',
    authCode: 'member:edit',
  },
  {
    id: '6',
    pid: '2',
    name: '删除会员',
    type: 'button',
    authCode: 'member:delete',
  },
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format as string || 'tree';

  if (format === 'tree') {
    return usePageResponseSuccess(1, 100, MOCK_MENUS);
  }

  return usePageResponseSuccess(1, 100, MOCK_MENUS);
});

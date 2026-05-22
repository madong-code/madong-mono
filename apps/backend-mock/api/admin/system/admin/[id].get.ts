import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const params = getRouterParams(event);
  const user = MOCK_USERS.find(u => u.id === Number(params.id)) || MOCK_USERS[0];

  return useResponseSuccess({
    id: user.id,
    user_name: user.username,
    real_name: user.realName,
    nick_name: user.realName,
    is_super: user.roles.includes('super') ? 1 : 0,
    mobile_phone: '13800138000',
    email: `${user.username}@example.com`,
    avatar: '',
    enabled: 1,
    dept_id: null,
    is_locked: 0,
    sex: 0,
    created_at: new Date().toISOString(),
    created_date: new Date().toLocaleString(),
    depts: [],
    posts: [],
    roles: []
  });
});

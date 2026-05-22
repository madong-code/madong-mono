import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  const users = MOCK_USERS.map((user, index) => ({
    id: user.id,
    user_name: user.username,
    real_name: user.realName,
    nick_name: user.realName,
    is_super: user.roles.includes('super') ? 1 : 0,
    mobile_phone: `1380013800${index}`,
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
  }));

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(users);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, users);
});

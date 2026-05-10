import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, MOCK_USERS.map((user, index) => ({
    id: user.id,
    user_name: user.username,
    real_name: user.realName,
    nick_name: user.realName,
    is_super: user.roles.includes('super') ? 1 : 0,
    enabled: 1,
    created_at: new Date().toISOString(),
    created_date: new Date().toLocaleString()
  })));
});

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_USERS = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 2000}`,
  username: `member${i + 21}`,
  real_name: `会员${i + 21}`,
  nickname: `会员昵称${i + 21}`,
  email: `member${i + 21}@example.com`,
  mobile: `1390000${String(i + 2000).slice(-4)}`,
  status: 1,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_USERS);
});

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1000}`,
  username: `member${i + 1}`,
  real_name: `会员${i + 1}`,
  nickname: `会员昵称${i + 1}`,
  email: `member${i + 1}@example.com`,
  mobile: `1380000${String(i + 1000).slice(-4)}`,
  status: i % 3 === 0 ? 0 : 1,
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

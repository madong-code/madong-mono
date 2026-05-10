import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_REVIEWS = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 7000}`,
  user_id: `${i + 1000}`,
  username: `user${i + 1}`,
  content: `这是一条审核内容${i + 1}`,
  type: i % 3,
  status: i % 4,
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
  created_date: new Date(Date.now() - i * 3600000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_REVIEWS);
});

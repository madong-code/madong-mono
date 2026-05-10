import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_POINTS = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 3000}`,
  user_id: `${i + 1000}`,
  username: `member${i + 1}`,
  type: i % 2 === 0 ? 1 : 2, // 1: 增加, 2: 减少
  points: i % 2 === 0 ? Math.floor(Math.random() * 100) + 10 : -Math.floor(Math.random() * 50) - 1,
  balance: 1000 + (i % 2 === 0 ? i * 10 : -i * 5),
  remark: i % 2 === 0 ? `签到获得积分${i + 1}` : `消费使用积分${i + 1}`,
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

  return usePageResponseSuccess(page, limit, MOCK_POINTS);
});

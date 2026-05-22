import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const MOCK_POINTS = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 3000}`,
  user_id: `${i + 1000}`,
  username: `member${i + 1}`,
  type: i % 2 === 0 ? 1 : 2,
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

  const id = getRouterParam(event, 'id');
  const point = MOCK_POINTS.find(item => item.id === id);

  return useResponseSuccess(point || MOCK_POINTS[0]);
});

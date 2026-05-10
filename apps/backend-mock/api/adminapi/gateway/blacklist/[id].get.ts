import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const TYPES = ['IP', '用户'];
const STATUS = [0, 1];

const MOCK_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: `${50000 + i}`,
  name: `黑名单${i + 1}`,
  type: TYPES[i % TYPES.length],
  target: i % 2 === 0 ? `192.168.2.${i % 255}` : `black_user_${i}`,
  reason: ['恶意攻击', '频繁请求', '未授权访问', '其他'][i % 4],
  status: STATUS[i % STATUS.length],
  start_time: Date.now() - 86400000,
  end_time: Date.now() + 86400000 * 30,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString(),
  updated_at: new Date(Date.now() - i * 43200000).toISOString(),
  updated_date: new Date(Date.now() - i * 43200000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  const item = MOCK_DATA.find(item => item.id === id);

  return useResponseSuccess(item || MOCK_DATA[0]);
});

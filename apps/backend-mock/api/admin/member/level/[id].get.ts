import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockLevel = {
  id: 1,
  name: '普通会员',
  level: 1,
  icon: '',
  points: 0,
  discount: 100,
  status: 1,
  sort: 1,
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString()
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockLevel);
});

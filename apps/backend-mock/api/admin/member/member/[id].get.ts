import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockMember = {
  id: 1,
  username: 'user1',
  nickname: '用户1',
  avatar: '',
  mobile: '13800138001',
  email: 'user1@example.com',
  sex: 1,
  status: 1,
  balance: '100.00',
  points: 10,
  level_id: 1,
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString()
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockMember);
});

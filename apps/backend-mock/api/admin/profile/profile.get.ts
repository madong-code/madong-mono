import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const user = MOCK_USERS.find(u => u.username === userinfo.username) || MOCK_USERS[0];

  return useResponseSuccess({
    id: user.id,
    user_name: user.username,
    real_name: user.realName,
    nick_name: user.realName,
    avatar: '',
    mobile_phone: '13800138000',
    email: `${user.username}@example.com`,
    sex: 0,
    birthday: null,
    tel: '',
    remark: '',
    created_at: new Date().toISOString(),
    created_date: new Date().toLocaleString()
  });
});

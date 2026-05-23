import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const findUser = MOCK_USERS.find(
    (item) => item.username === userinfo.username,
  );

  return useResponseSuccess({
    id: findUser?.id,
    user_name: findUser?.username,
    real_name: findUser?.realName,
    nick_name: findUser?.realName,
    is_super: findUser?.roles.includes('super') ? 1 : 0,
    mobile_phone: '13800138000',
    email: `${findUser?.username}@example.com`,
    avatar: '',
    signed: '',
    dashboard: '',
    dept_id: '',
    enabled: 1,
    login_ip: '127.0.0.1',
    login_time: Date.now(),
    created_by: null,
    updated_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    sex: 0,
    remark: '',
    birthday: null,
    tel: '',
    is_locked: 0,
    role_id_list: [],
    post_id_list: [],
    created_date: new Date().toLocaleString(),
    updated_date: new Date().toLocaleString(),
    depts: [],
    posts: [],
    casbin: [],
    roles: [],
  });
});

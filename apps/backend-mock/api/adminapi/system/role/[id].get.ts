import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockRole = {
  id: 1,
  pid: 0,
  name: '超级管理员',
  code: 'super',
  role_type: 1,
  data_scope: 1,
  enabled: 1,
  sort: 1,
  remark: '超级管理员',
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString(),
  scopes: []
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockRole);
});

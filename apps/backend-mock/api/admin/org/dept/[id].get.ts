import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockDept = {
  id: 1,
  pid: 0,
  name: '总公司',
  code: 'HQ',
  level: 1,
  main_leader_id: null,
  phone: '',
  enabled: 1,
  sort: 1,
  remark: '',
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString()
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockDept);
});

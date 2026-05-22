import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockConfig = {
  id: 1,
  name: '网站标题',
  code: 'site_title',
  value: 'Madong SaaS',
  type: 'string',
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

  return useResponseSuccess(mockConfig);
});

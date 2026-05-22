import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockPlugin = {
  id: 1,
  name: 'Demo插件',
  code: 'demo',
  version: '1.0.0',
  author: '作者',
  description: '演示插件',
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

  return useResponseSuccess(mockPlugin);
});

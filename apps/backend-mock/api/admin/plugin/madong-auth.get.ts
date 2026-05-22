import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_AUTH_PLUGINS = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 6000}`,
  name: `认证插件${i + 1}`,
  type: 'oauth',
  provider: ['wechat', 'qq', 'weibo', 'github', 'google'][i % 5],
  status: i % 2 === 0 ? 1 : 0,
  config: {
    app_id: `app_id_${i + 1}`,
    app_secret: `app_secret_${i + 1}`,
  },
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_AUTH_PLUGINS);
});
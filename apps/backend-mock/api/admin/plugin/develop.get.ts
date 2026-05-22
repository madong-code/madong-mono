import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_PLUGINS = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 5000}`,
  name: `插件${i + 1}`,
  code: `plugin${i + 1}`,
  description: `这是插件${i + 1}的描述`,
  version: '1.0.' + i,
  author: '开发者' + (i + 1),
  status: i % 3 === 0 ? 0 : (i % 3 === 1 ? 1 : 2), // 0: 禁用, 1: 启用, 2: 未安装
  type: 'madong:plugin',
  support_app: 'admin',
  cover: null,
  icon: null,
  installed_at: i % 3 !== 2 ? new Date(Date.now() - i * 86400000).toISOString() : null,
  created_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  created_date: new Date(Date.now() - i * 86400000 * 7).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_PLUGINS);
});

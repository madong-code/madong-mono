import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const MOCK_PLUGINS = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 5000}`,
  name: `插件${i + 1}`,
  code: `plugin${i + 1}`,
  description: `这是插件${i + 1}的描述`,
  version: '1.0.' + i,
  author: '开发者' + (i + 1),
  status: i % 3 === 0 ? 0 : (i % 3 === 1 ? 1 : 2),
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

  const id = getRouterParam(event, 'id');
  const plugin = MOCK_PLUGINS.find(item => item.id === id);

  return useResponseSuccess(plugin || MOCK_PLUGINS[0]);
});

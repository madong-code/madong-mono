import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockPlugins = [
  { id: 1, name: 'Demo插件', code: 'demo', version: '1.0.0', author: '作者', description: '演示插件', status: 1, sort: 1, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, name: '问答模块', code: 'ask', version: '1.0.0', author: '作者', description: '问答模块插件', status: 0, sort: 2, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockPlugins);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockPlugins);
});

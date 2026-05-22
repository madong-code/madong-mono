import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockConfigs = [
  { id: 1, name: '网站标题', code: 'site_title', value: 'Madong SaaS', type: 'string', enabled: 1, sort: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, name: '网站描述', code: 'site_desc', value: 'Madong SaaS Platform', type: 'string', enabled: 1, sort: 2, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockConfigs);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockConfigs);
});

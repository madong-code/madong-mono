import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockRules = [
  { id: 1, ptree: '0', type: 'data', name: '数据权限规则1', expression: '', status: 1, sort: 1, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, ptree: '0', type: 'data', name: '数据权限规则2', expression: '', status: 1, sort: 2, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockRules);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockRules);
});

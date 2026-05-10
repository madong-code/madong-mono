import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockRoles = [
  { id: 1, pid: 0, name: '超级管理员', code: 'super', role_type: 1, data_scope: 1, enabled: 1, sort: 1, remark: '超级管理员', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, pid: 0, name: '管理员', code: 'admin', role_type: 1, data_scope: 1, enabled: 1, sort: 2, remark: '管理员', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, pid: 0, name: '普通用户', code: 'user', role_type: 1, data_scope: 1, enabled: 1, sort: 3, remark: '普通用户', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockRoles);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockRoles);
});

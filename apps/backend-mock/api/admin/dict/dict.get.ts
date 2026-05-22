import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockDicts = [
  { id: 1, name: '性别', code: 'gender', enabled: 1, sort: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, name: '状态', code: 'status', enabled: 1, sort: 2, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, name: '类型', code: 'type', enabled: 1, sort: 3, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockDicts);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockDicts);
});

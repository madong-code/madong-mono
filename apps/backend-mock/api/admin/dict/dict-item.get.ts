import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockDictItems = [
  { id: 1, dict_id: 1, label: '男', value: '1', sort: 1, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, dict_id: 1, label: '女', value: '2', sort: 2, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, dict_id: 2, label: '启用', value: '1', sort: 1, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 4, dict_id: 2, label: '禁用', value: '0', sort: 2, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockDictItems);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockDictItems);
});

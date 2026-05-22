import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockRecycleBin = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  table_name: 'sys_user',
  original_data: JSON.stringify({ id: i, name: `用户${i}` }),
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString()
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockRecycleBin);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockRecycleBin);
});

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockLevels = [
  { id: 1, name: '普通会员', level: 1, icon: '', points: 0, discount: 100, status: 1, sort: 1, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, name: '白银会员', level: 2, icon: '', points: 100, discount: 95, status: 1, sort: 2, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, name: '黄金会员', level: 3, icon: '', points: 500, discount: 90, status: 1, sort: 3, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 4, name: '白金会员', level: 4, icon: '', points: 1000, discount: 85, status: 1, sort: 4, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 5, name: '钻石会员', level: 5, icon: '', points: 5000, discount: 80, status: 1, sort: 5, created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockLevels);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockLevels);
});

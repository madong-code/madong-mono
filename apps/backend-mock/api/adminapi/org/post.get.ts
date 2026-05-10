import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockPosts = [
  { id: 1, dept_id: 2, name: '前端开发', code: 'FRONT_DEV', sort: 1, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, dept_id: 2, name: '后端开发', code: 'BACK_DEV', sort: 2, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, dept_id: 3, name: '产品经理', code: 'PM', sort: 1, enabled: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockPosts);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockPosts);
});

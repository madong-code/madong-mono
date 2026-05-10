import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockMembers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: `用户${i + 1}`,
  avatar: '',
  mobile: `138001380${i.toString().padStart(2, '0')}`,
  email: `user${i + 1}@example.com`,
  sex: i % 2 === 0 ? 1 : 2,
  status: i % 2 === 0 ? 1 : 0,
  balance: (i * 100).toFixed(2),
  points: i * 10,
  level_id: (i % 5) + 1,
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
    return useResponseSuccess(mockMembers);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockMembers);
});

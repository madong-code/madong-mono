import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_TAGS = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 4000}`,
  name: `标签${i + 1}`,
  code: `tag${i + 1}`,
  sort: i,
  status: i % 5 === 0 ? 0 : 1,
  remark: `这是标签${i + 1}的备注`,
  member_count: Math.floor(Math.random() * 100),
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_TAGS);
});

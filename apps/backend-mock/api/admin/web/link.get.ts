import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_LINKS = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 9000}`,
  name: `链接${i + 1}`,
  url: `https://example${i + 1}.com`,
  logo: `https://example${i + 1}.com/logo.png`,
  sort: i,
  status: i % 2 === 0 ? 1 : 0,
  remark: `这是链接${i + 1}的备注`,
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

  return usePageResponseSuccess(page, limit, MOCK_LINKS);
});

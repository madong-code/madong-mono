import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_CLIENTS = (() => {
  const data = [];
  for (let i = 0; i < 8; i++) {
    data.push({
      id: `${i + 1}`,
      name: `OAuth客户端${i + 1}`,
      client_id: `client_${Date.now().toString(36)}_${i}`,
      client_secret: '******',
      redirect_uri: `https://example${i + 1}.com/callback`,
      grant_types: ['authorization_code', 'refresh_token'],
      scope: 'read write',
      access_token_lifetime: 3600,
      refresh_token_lifetime: 86400,
      enabled: i % 4 === 0 ? 0 : 1,
      created_at: new Date(Date.now() - Math.random() * 1e11).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    });
  }
  return data;
})();

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  let filtered = MOCK_CLIENTS;

  if (query.LIKE_name) {
    filtered = filtered.filter((item) => item.name.includes(query.LIKE_name as string));
  }
  if (query.LIKE_client_id) {
    filtered = filtered.filter((item) => item.client_id.includes(query.LIKE_client_id as string));
  }
  if (query.EQ_enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(query.EQ_enabled));
  }

  return usePageResponseSuccess(page, pageSize, filtered);
});
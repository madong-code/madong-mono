import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

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

  const id = event.context.params?.id;
  const item = MOCK_CLIENTS.find((d) => d.id === id);
  return useResponseSuccess(item);
});
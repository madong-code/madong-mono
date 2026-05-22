import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const MOCK_TENANTS = (() => {
  const data = [];
  for (let i = 0; i < 15; i++) {
    data.push({
      id: `${i + 1}`,
      name: `租户${i + 1}`,
      code: `TENANT_${String(i + 1).padStart(4, '0')}`,
      domain: `tenant${i + 1}.example.com`,
      logo: '',
      status: i % 5 === 0 ? 0 : 1,
      expire_time: new Date(Date.now() + Math.random() * 1e12).toISOString(),
      max_users: 100 + i * 50,
      current_users: Math.floor(Math.random() * (50 + i * 20)),
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
  const item = MOCK_TENANTS.find((d) => d.id === id);
  return useResponseSuccess(item);
});
import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

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

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  let filtered = MOCK_TENANTS;

  if (query.LIKE_name) {
    filtered = filtered.filter((item) => item.name.includes(query.LIKE_name as string));
  }
  if (query.LIKE_code) {
    filtered = filtered.filter((item) => item.code.includes(query.LIKE_code as string));
  }
  if (query.EQ_status !== undefined) {
    filtered = filtered.filter((item) => item.status === Number(query.EQ_status));
  }

  return usePageResponseSuccess(page, pageSize, filtered);
});
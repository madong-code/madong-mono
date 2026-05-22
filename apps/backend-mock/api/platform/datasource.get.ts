import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_DATASOURCES = (() => {
  const data = [];
  const types = ['mysql', 'postgresql', 'sqlite', 'sqlserver', 'oracle'];
  for (let i = 0; i < 10; i++) {
    data.push({
      id: `${i + 1}`,
      name: `数据源${i + 1}`,
      type: types[i % types.length],
      host: `192.168.1.${i + 10}`,
      port: 3306 + i,
      database: `db_${i + 1}`,
      username: `user_${i + 1}`,
      password: '******',
      charset: 'utf8mb4',
      enabled: i % 3 === 0 ? 0 : 1,
      remark: `这是第${i + 1}个数据源`,
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

  let filtered = MOCK_DATASOURCES;

  if (query.LIKE_name) {
    filtered = filtered.filter((item) => item.name.includes(query.LIKE_name as string));
  }
  if (query.LIKE_type) {
    filtered = filtered.filter((item) => item.type.includes(query.LIKE_type as string));
  }
  if (query.EQ_enabled !== undefined) {
    filtered = filtered.filter((item) => item.enabled === Number(query.EQ_enabled));
  }

  return usePageResponseSuccess(page, pageSize, filtered);
});
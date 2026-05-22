import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

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

  const id = event.context.params?.id;
  const item = MOCK_DATASOURCES.find((d) => d.id === id);
  return useResponseSuccess(item);
});
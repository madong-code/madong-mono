import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const MOCK_RESOURCES = (() => {
  const data = [];
  const types = ['storage', 'bandwidth', 'api', 'database'];
  for (let i = 0; i < 20; i++) {
    data.push({
      id: `${i + 1}`,
      tenant_id: `${Math.floor(i / 4) + 1}`,
      resource_type: types[i % types.length],
      resource_name: types[i % types.length] === 'storage' ? '存储空间' :
                     types[i % types.length] === 'bandwidth' ? '带宽' :
                     types[i % types.length] === 'api' ? 'API调用' : '数据库连接',
      resource_key: `${types[i % types.length]}_${i + 1}`,
      quota: 1000 + i * 100,
      used: Math.floor(Math.random() * (500 + i * 50)),
      created_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    });
  }
  return data;
})();

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const tenantId = event.context.params?.id;
  const resources = MOCK_RESOURCES.filter((r) => r.tenant_id === tenantId);
  return useResponseSuccess(resources);
});
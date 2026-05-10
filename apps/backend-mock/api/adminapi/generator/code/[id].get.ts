import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const MOCK_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: `${60000 + i}`,
  table_name: `example_${i}`,
  table_content: `示例表${i + 1}`,
  module_name: `example_${i}`,
  class_name: `Example${i}`,
  edit_type: i % 2,
  plugin_name: '',
  order_type: 0,
  parent_menu: '',
  relations: null,
  push_sync_count: Math.floor(Math.random() * 10),
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString(),
  updated_at: new Date(Date.now() - i * 43200000).toISOString(),
  updated_date: new Date(Date.now() - i * 43200000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  const item = MOCK_DATA.find(item => item.id === id);

  return useResponseSuccess(item || MOCK_DATA[0]);
});

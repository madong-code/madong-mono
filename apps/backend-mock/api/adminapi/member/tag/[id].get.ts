import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

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

  const id = getRouterParam(event, 'id');
  const tag = MOCK_TAGS.find(item => item.id === id);

  return useResponseSuccess(tag || MOCK_TAGS[0]);
});

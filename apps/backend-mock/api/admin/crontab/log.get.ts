import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_LOGS = Array.from({ length: 50 }, (_, i) => ({
  id: `${10000 + i}`,
  crontab_id: `${100 + (i % 10)}`,
  crontab_name: `定时任务${i % 10 + 1}`,
  target: `task_${i % 5}`,
  parameter: `{\"key\": \"value${i}\"}`,
  exception: i % 5 === 0 ? '连接超时错误' : '',
  status: i % 5 === 0 ? 2 : (i % 5 === 1 ? 0 : 1),
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
  created_date: new Date(Date.now() - i * 3600000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_LOGS);
});

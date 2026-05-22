import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockCrontabs = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `定时任务 ${i + 1}`,
  expression: '0 0 * * *',
  type: 'command',
  target: '/path/to/command',
  status: i % 2 === 0 ? 1 : 0,
  last_run_time: i % 2 === 0 ? new Date(Date.now() - i * 3600000).toISOString() : null,
  remark: '',
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  created_date: new Date(Date.now() - i * 86400000).toLocaleString()
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select') {
    return useResponseSuccess(mockCrontabs);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockCrontabs);
});

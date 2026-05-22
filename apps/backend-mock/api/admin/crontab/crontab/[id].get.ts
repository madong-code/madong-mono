import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockCrontab = {
  id: 1,
  name: '定时任务 1',
  expression: '0 0 * * *',
  type: 'command',
  target: '/path/to/command',
  status: 1,
  last_run_time: new Date(Date.now() - 3600000).toISOString(),
  remark: '',
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString()
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockCrontab);
});

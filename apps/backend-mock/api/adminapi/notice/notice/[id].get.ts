import { eventHandler, getRouterParams } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockNotice = {
  id: 1,
  title: '通知公告 1',
  content: '这是通知公告的内容',
  type: 1,
  status: 1,
  sort: 1,
  created_at: new Date().toISOString(),
  created_date: new Date().toLocaleString()
};

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockNotice);
});

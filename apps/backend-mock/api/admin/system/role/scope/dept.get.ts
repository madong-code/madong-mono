import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

const mockDepts = [
  { id: 1, pid: 0, name: '总公司' },
  { id: 2, pid: 1, name: '技术部' },
  { id: 3, pid: 1, name: '产品部' },
  { id: 4, pid: 2, name: '前端组' },
  { id: 5, pid: 2, name: '后端组' }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess(mockDepts);
});

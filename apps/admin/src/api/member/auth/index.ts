import { requestClient } from '#/api/request';

const BASE_URL = '/member/auth';

export const MemberAuthService = {
  /** 获取会员认证信息 */
  getAuthInfo() {
    return requestClient.get(BASE_URL);
  },
};

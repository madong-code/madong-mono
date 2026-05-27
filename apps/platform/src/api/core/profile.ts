import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 更新用户基本信息
 * @param data 支持字段：real_name, nick_name, email, mobile_phone, avatar
 */
export async function updateUserInfoApi(data: {
  real_name?: string;
  nick_name?: string;
  email?: string;
  mobile_phone?: string;
  avatar?: string;
}) {
  return requestClient.put<UserInfo>('/auth/user-info', data);
}

/**
 * 修改密码
 */
export async function changePasswordApi(data: {
  old_password: string;
  new_password: string;
}) {
  return requestClient.put('/auth/password', data);
}

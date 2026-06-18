import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 更新用户基本信息
 * @param data 支持字段：real_name, nick_name, email, mobile_phone, avatar
 */
export async function updateUserInfoApi(data: {
  avatar?: string;
  email?: string;
  mobile_phone?: string;
  nick_name?: string;
  real_name?: string;
}) {
  return requestClient.put<UserInfo>('/auth/user-info', data);
}

/**
 * 上传头像文件到专用端点，后端自动保存并更新用户头像
 * @param file 头像 File 对象
 * @returns Promise<{ avatar: string }>
 */
export async function uploadAvatarFile(
  file: File,
): Promise<{ avatar: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.put('/auth/avatar', formData, {
    headers: { 'Content-Type': undefined },
  });
}

/**
 * 修改密码
 */
export async function changePasswordApi(data: {
  new_password: string;
  old_password: string;
}) {
  return requestClient.put('/auth/password', data);
}

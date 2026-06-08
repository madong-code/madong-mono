import type { TenantPluginListResponse } from './types';

import { requestClient, sse } from '#/api/request';

const baseUrl = '/tenant/plugin';

export const TenantPluginService = {
  /** 获取当前租户可用插件列表 */
  getList(params?: {
    page?: number;
    size?: number;
  }): Promise<TenantPluginListResponse> {
    return requestClient.get(baseUrl, { params });
  },

  /**
   * SSE 流式安装插件，支持实时进度反馈
   * @param code 插件编码
   * @param onProgress 进度回调 (message, progress)
   */
  installViaSSE(
    code: string,
    onProgress?: (message: string, progress: number) => void,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${baseUrl}/install?code=${encodeURIComponent(code)}`;
      const conn = sse(url, {
        progress: (payload: any) => {
          if (onProgress && payload?.data?.message) {
            onProgress(payload.data.message, payload.data.progress ?? 0);
          }
        },
        completed: (payload: any) => {
          resolve(payload?.data);
          setTimeout(() => conn.close(), 100);
        },
        success: (payload: any) => {
          resolve(payload?.data);
          setTimeout(() => conn.close(), 100);
        },
        error: (payload: any) => {
          reject(new Error(payload?.data?.message || '安装失败'));
          setTimeout(() => conn.close(), 100);
        },
        onError: () => {
          reject(new Error('SSE连接失败'));
          setTimeout(() => conn.close(), 100);
        },
      });
    });
  },

  /**
   * SSE 流式卸载插件，支持实时进度反馈
   * @param code 插件编码
   * @param onProgress 进度回调 (message, progress)
   */
  uninstallViaSSE(
    code: string,
    onProgress?: (message: string, progress: number) => void,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${baseUrl}/uninstall?code=${encodeURIComponent(code)}`;
      const conn = sse(url, {
        progress: (payload: any) => {
          if (onProgress && payload?.data?.message) {
            onProgress(payload.data.message, payload.data.progress ?? 0);
          }
        },
        completed: (payload: any) => {
          resolve(payload?.data);
          setTimeout(() => conn.close(), 100);
        },
        success: (payload: any) => {
          resolve(payload?.data);
          setTimeout(() => conn.close(), 100);
        },
        error: (payload: any) => {
          reject(new Error(payload?.data?.message || '卸载失败'));
          setTimeout(() => conn.close(), 100);
        },
        onError: () => {
          reject(new Error('SSE连接失败'));
          setTimeout(() => conn.close(), 100);
        },
      });
    });
  },
};

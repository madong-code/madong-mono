import { requestClient } from '#/api/request';
import BaseService from '../core/base';
import type { DbSettingRow } from './types';

const baseUrl = '/db-settings'

export const DbSettingService = {
  ...BaseService<DbSettingRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),

  /** 测试数据源连接（基于已有记录） */
  testConnection(id: number | string): Promise<any> {
    return requestClient.get(`${baseUrl}/${id}/test`);
  },

  /** 测试连接（直接传入参数，不保存） */
  testConnectionByParams(params: {
    driver: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password?: string;
    prefix?: string;
  }): Promise<any> {
    return requestClient.post(`${baseUrl}/test`, params);
  },
};

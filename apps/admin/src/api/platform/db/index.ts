import { requestClient } from '#/api/request';
import BaseService from '../../core/base';
import type { DbSettingRow } from './types';

const baseUrl = '/db-settings'

export const DbSettingService = {
  ...BaseService<DbSettingRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
};

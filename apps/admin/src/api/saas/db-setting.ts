import { requestClient } from '#/api/request';
import BaseService from '../core/base';



const baseUrl = '/db-settings'

export const DbSettingService = {
    ...BaseService<any>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  })
};

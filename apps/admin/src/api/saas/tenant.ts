import BaseService from '../core/base';


const baseUrl = '/tenant'

export const TenantService = {
  ...BaseService<any>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  })
};

import BaseService from '#/api/core/base';

const baseUrl = '/system/user';

export const UserService = {
  ...BaseService({ baseUrl }),
};

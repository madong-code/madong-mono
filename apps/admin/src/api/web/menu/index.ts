import BaseService from '#/api/core/base'
import type { Menu } from './types'

const baseUrl = '/web/menu'

export const WebMenuService = {
  ...BaseService<Menu>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
}

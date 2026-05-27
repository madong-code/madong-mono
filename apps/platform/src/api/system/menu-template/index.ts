import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'

const baseUrl = '/menu-template'

export const MenuTemplateService = {
  ...BaseService({ baseUrl }),

  list(params?: Record<string, any>): Promise<any> {
    return requestClient.get(`${baseUrl}/list`, { params })
  },
}

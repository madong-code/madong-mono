import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'

const baseUrl = '/platform-menu'

export const PlatformMenuService = {
  ...BaseService({ baseUrl, forbiddenMethods: ['batchRemove'] }),

  /** 获取平台菜单树（用于上级菜单选择器） */
  tree(params?: Record<string, any>): Promise<any> {
    return requestClient.get(`${baseUrl}/tree`, { params })
  },
}

import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { DictOptions, DictRow, DictItemRow } from './types'

const baseUrl = '/system/dict'

export const DictService = {
  ...BaseService<DictRow>({ baseUrl, forbiddenMethods: ['list', 'get', 'create', 'update', 'remove', 'delete', 'export', 'changStatus'] }),

  enumDictList(params?: any): Promise<DictRow[]> {
    return requestClient.get(`${baseUrl}/enum-dict-list`, { params })
  },

  getByDictType(params?: any): Promise<DictOptions[]> {
    return requestClient.get(`${baseUrl}/options/by-type`, { params })
  },

  getAllDict(params?: any): Promise<any[]> {
    return requestClient.get(`${baseUrl}/enum/list`, { params })
  },
}

export const DictItemService = {
  ...BaseService<DictItemRow>({ baseUrl: '/system/dict-item', forbiddenMethods: ['list', 'create', 'update', 'remove', 'delete', 'export', 'changStatus'] }),
  /**
   * 根据字典ID获取字典项列表
   */
  getByDictId(dictId: number): Promise<any> {
    return requestClient.get(`/system/dict/options/by-type`, { params: { dictId } })
  },
}

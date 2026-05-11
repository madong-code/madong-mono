import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { RecycleBinRow } from './types'

const baseUrl = '/system/recycle'

export const RecycleBinService = {
  ...BaseService<RecycleBinRow>({ baseUrl }),

  restore(data: Record<string, any>) {
    return requestClient.put(baseUrl, data)
  },
}

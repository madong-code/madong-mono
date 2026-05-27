import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { DeptRow, DeptTree } from './types'

const baseUrl = '/system/dept'

export const DeptService = {
  ...BaseService<DeptRow>({ baseUrl }),

  getTree(args?: Record<string, any>): Promise<DeptTree[]> {
    const params = { ...args, format: 'tree' }
    return requestClient.get(baseUrl, { params })
  },
}

import BaseService from '#/api/core/base'
import type { OperateRecordRow } from './types'

const baseUrl = '/monitor/operation-log'

export const OperateLogService = {
  ...BaseService<OperateRecordRow>({ baseUrl, allowedMethods: ['list', 'get', 'remove'] }),
}

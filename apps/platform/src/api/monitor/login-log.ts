import BaseService from '#/api/core/base'
import type { LoginRecordRow } from './types'

const baseUrl = '/monitor/login-log'

export const LoginLogService = {
  ...BaseService<LoginRecordRow>({ baseUrl, allowedMethods: ['list', 'get', 'remove'] }),
}

import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { CrontabRow, CrontabLogRow } from './types'

const baseUrl = '/crontab/task'

export const CrontabService = {
  ...BaseService<CrontabRow>({ baseUrl }),

  start(id: string | number, params?: Record<string, any>) {
    return requestClient.put(`${baseUrl}/${id}/resume`, params)
  },

  resume(id: string | number, params?: Record<string, any>) {
    return requestClient.put(`${baseUrl}/${id}/resume`, params)
  },

  pause(id: string | number, params?: Record<string, any>) {
    return requestClient.put(`${baseUrl}/${id}/pause`, params)
  },

  execute(id: string | number, params?: Record<string, any>) {
    return requestClient.put(`${baseUrl}/${id}/execute`, params)
  },
}

export const CrontabLogService = {
  ...BaseService<CrontabLogRow>({ baseUrl: '/crontab/log' }),
}

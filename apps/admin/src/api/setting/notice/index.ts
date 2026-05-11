import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { NoticeRow } from './types'

const baseUrl = '/notice'

export const NoticeService = {
  ...BaseService<NoticeRow>({ baseUrl }),

  publish(data: any) {
    return requestClient.post(`${baseUrl}/publish`, data)
  },
}

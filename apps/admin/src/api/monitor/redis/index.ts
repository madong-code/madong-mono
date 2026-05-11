import { requestClient } from '#/api/request'
import type { RedisMonitorData } from './types'

const baseUrl = '/monitor/redis'

export const RedisService = {
  list(params?: Record<string, any>): Promise<RedisMonitorData> {
    return requestClient.get(baseUrl, { params })
  },
}

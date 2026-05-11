import { requestClient } from '#/api/request'
import type { ServerInfo } from './types'

const baseUrl = '/monitor/server'

export const ServerService = {
  list(params?: Record<string, any>): Promise<ServerInfo> {
    return requestClient.get(baseUrl, { params })
  },
}

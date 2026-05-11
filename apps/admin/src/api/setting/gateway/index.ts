import BaseService from '#/api/core/base'
import type { GatewayLimiterRow, GatewayBlacklistRow } from './types'

export const GatewayLimiterService = {
  ...BaseService<GatewayLimiterRow>({ baseUrl: '/gateway/limiter' }),
}

export const GatewayBlacklistService = {
  ...BaseService<GatewayBlacklistRow>({ baseUrl: '/gateway/blacklist' }),
}

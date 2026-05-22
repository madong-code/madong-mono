import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess({
    version: '7.0.0',
    connected_clients: Math.floor(Math.random() * 50 + 10),
    used_memory: Math.floor(Math.random() * 500 * 1024 * 1024 + 100 * 1024 * 1024),
    used_memory_human: `${Math.floor(Math.random() * 400 + 100)}MB`,
    used_memory_peak: Math.floor(Math.random() * 600 * 1024 * 1024 + 200 * 1024 * 1024),
    used_memory_peak_human: `${Math.floor(Math.random() * 500 + 200)}MB`,
    total_system_memory: 8 * 1024 * 1024 * 1024,
    total_system_memory_human: '8GB',
    uptime_in_seconds: 86400 * 30,
    uptime_in_days: 30,
    keyspace_hits: Math.floor(Math.random() * 1000000),
    keyspace_misses: Math.floor(Math.random() * 10000),
    hit_rate: Math.floor(Math.random() * 20 + 95),
    db0: {
      keys: Math.floor(Math.random() * 1000 + 100),
      expires: Math.floor(Math.random() * 500),
      avg_ttl: Math.floor(Math.random() * 86400),
    },
    db1: {
      keys: Math.floor(Math.random() * 500 + 50),
      expires: Math.floor(Math.random() * 200),
      avg_ttl: Math.floor(Math.random() * 43200),
    },
  });
});

import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess({
    cpu: {
      percent: Math.floor(Math.random() * 80 + 10),
      cores: 8,
      model: 'Intel(R) Core(TM) i7-10700K',
      frequency: '3.8GHz',
    },
    memory: {
      total: 16 * 1024 * 1024 * 1024,
      used: Math.floor(Math.random() * 12 * 1024 * 1024 * 1024 + 2 * 1024 * 1024 * 1024),
      free: Math.floor(Math.random() * 4 * 1024 * 1024 * 1024 + 1 * 1024 * 1024 * 1024),
      percent: Math.floor(Math.random() * 70 + 30),
    },
    disk: {
      total: 512 * 1024 * 1024 * 1024,
      used: Math.floor(Math.random() * 350 * 1024 * 1024 * 1024 + 100 * 1024 * 1024 * 1024),
      free: Math.floor(Math.random() * 150 * 1024 * 1024 * 1024 + 50 * 1024 * 1024 * 1024),
      percent: Math.floor(Math.random() * 70 + 30),
      mount_point: '/',
    },
    php: {
      version: '8.2.10',
      sapi: 'cli',
      extensions: ['json', 'mbstring', 'pdo', 'redis', 'swoole'],
      timezone: 'Asia/Shanghai',
      memory_limit: '512M',
    },
  });
});

import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResponseSuccess({
    total_keys: 1000,
    translated_keys: 850,
    languages: {
      'zh-CN': { total: 1000, translated: 1000 },
      'zh-TW': { total: 1000, translated: 800 },
      'en': { total: 1000, translated: 900 },
      'ja': { total: 1000, translated: 500 },
      'ko': { total: 1000, translated: 400 },
    },
  });
});

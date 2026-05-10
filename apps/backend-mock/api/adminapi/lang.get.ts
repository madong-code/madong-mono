import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_DATA = Array.from({ length: 30 }, (_, i) => ({
  key: `translation.key.${i}`,
  value: `翻译内容${i}`,
  language: ['zh-CN', 'en'][i % 2],
  file: ['admin', 'common', 'validations'][i % 3],
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_DATA);
});

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const MOCK_FILES = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 8000}`,
  name: `file${i + 1}.${['jpg', 'png', 'pdf', 'doc', 'xls'][i % 5]}`,
  size: Math.floor(Math.random() * 1024 * 1024) + 1024,
  size_human: `${(Math.floor(Math.random() * 1024) + 1)} KB`,
  mime_type: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.ms-excel'][i % 5],
  url: `https://example.com/uploads/file${i + 1}.${['jpg', 'png', 'pdf', 'doc', 'xls'][i % 5]}`,
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
  created_date: new Date(Date.now() - i * 3600000).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 15;

  return usePageResponseSuccess(page, limit, MOCK_FILES);
});

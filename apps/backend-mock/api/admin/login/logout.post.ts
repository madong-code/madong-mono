import { eventHandler } from 'h3';
import { clearRefreshTokenCookie } from '~/utils/cookie-utils';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  clearRefreshTokenCookie(event);
  return useResponseSuccess({});
});

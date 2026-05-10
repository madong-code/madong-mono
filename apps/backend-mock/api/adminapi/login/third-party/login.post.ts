import { eventHandler, readBody } from 'h3';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { setRefreshTokenCookie } from '~/utils/cookie-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const user = MOCK_USERS[0];
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({
    token_type: 'Bearer',
    expires_in: 7200,
    access_token: accessToken,
    refresh_token: refreshToken
  });
});

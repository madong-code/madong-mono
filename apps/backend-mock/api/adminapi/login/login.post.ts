import { eventHandler, readBody } from 'h3';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { setRefreshTokenCookie } from '~/utils/cookie-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { forbiddenResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { user_name, password } = body;

  const findUser = MOCK_USERS.find(
    (item) => item.username === user_name && item.password === password
  );

  if (!findUser) {
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({
    token_type: 'Bearer',
    expires_in: 7200,
    access_token: accessToken,
    refresh_token: refreshToken
  });
});

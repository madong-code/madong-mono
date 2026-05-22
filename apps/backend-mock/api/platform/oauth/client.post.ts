import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  return useResponseSuccess({ 
    id: Date.now(), 
    client_id: `client_${Date.now().toString(36)}`,
    client_secret: '******',
    ...body 
  });
});
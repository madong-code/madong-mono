import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  const pluginKey = body.plugin_key || 'test';

  return useResponseSuccess({
    plugin_key: pluginKey,
    zip_path: `/tmp/madong/server/runtime/adminapi/${pluginKey}.zip`,
    has_frontend: Math.random() > 0.5,
  });
});

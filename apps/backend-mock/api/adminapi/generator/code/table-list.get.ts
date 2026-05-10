import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const TABLES = [
  'admin', 'admin_role', 'admin_roles', 'menu', 'operation_log', 'dept',
  'dict', 'dict_data', 'post', 'login_log', 'member', 'member_level',
  'crontab', 'crontab_log', 'attachment', 'attachment_categroy'
];

const MOCK_DATA = TABLES.map((name, i) => ({
  name,
  comment: `${name}表`,
  engine: 'InnoDB',
  collation: 'utf8mb4_general_ci',
  create_time: new Date(Date.now() - i * 86400000 * 30).toLocaleString(),
}));

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 20;

  return usePageResponseSuccess(page, limit, MOCK_DATA);
});

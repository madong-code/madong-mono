import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, usePageResponseSuccess, useResponseSuccess } from '~/utils/response';

const mockDepts = [
  { id: 1, pid: 0, name: '总公司', code: 'HQ', level: 1, main_leader_id: null, phone: '', enabled: 1, sort: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 2, pid: 1, name: '技术部', code: 'TECH', level: 2, main_leader_id: null, phone: '', enabled: 1, sort: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 3, pid: 1, name: '产品部', code: 'PROD', level: 2, main_leader_id: null, phone: '', enabled: 1, sort: 2, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 4, pid: 2, name: '前端组', code: 'FRONT', level: 3, main_leader_id: null, phone: '', enabled: 1, sort: 1, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() },
  { id: 5, pid: 2, name: '后端组', code: 'BACK', level: 3, main_leader_id: null, phone: '', enabled: 1, sort: 2, remark: '', created_at: new Date().toISOString(), created_date: new Date().toLocaleString() }
];

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const format = query.format;

  if (format === 'tree' || format === 'select' || format === 'table_tree') {
    return useResponseSuccess(mockDepts);
  }

  const page = Number(query.page) || 1;
  const pageSize = Number(query.limit) || 10;

  return usePageResponseSuccess(page, pageSize, mockDepts);
});

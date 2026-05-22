import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const key = query.key as string;
  const language = (query.language as string) || 'zh-CN';

  const translations: Record<string, Record<string, string>> = {
    'zh-CN': {
      'common.create': '创建',
      'common.edit': '编辑',
      'common.delete': '删除',
      'common.search': '搜索',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.confirm': '确认',
      'common.back': '返回',
      'common.success': '操作成功',
      'common.error': '操作失败',
    },
    'en': {
      'common.create': 'Create',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.search': 'Search',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.back': 'Back',
      'common.success': 'Success',
      'common.error': 'Error',
    },
  };

  return useResponseSuccess(
    translations[language]?.[key] || key
  );
});

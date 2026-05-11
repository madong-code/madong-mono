import type { CrudSchema } from '#/adapter/crud'

import { MemberService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MemberService.list,
      add: MemberService.create,
      edit: MemberService.update,
      remove: MemberService.remove,
      view: MemberService.get,
    },
    dialogTitle: $t('member.user.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'member:user:create',
    removeAuth: 'member:user:delete',
    editAuth: 'member:user:update',
    viewAuth: 'member:user:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.user.table.columns.id'), minWidth: 60, visible: false },
      { field: 'username', title: $t('member.user.table.columns.username'), minWidth: 100 },
      { field: 'nickname', title: $t('member.user.table.columns.nickname'), minWidth: 100 },
      { field: 'phone', title: $t('member.user.table.columns.phone'), minWidth: 120 },
      { field: 'email', title: $t('member.user.table.columns.email'), minWidth: 160 },
      { field: 'level_name', title: $t('member.user.table.columns.level_name'), minWidth: 100 },
      { field: 'points', title: $t('member.user.table.columns.points'), minWidth: 80 },
      {
        field: 'status',
        title: $t('member.user.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'created_at', title: $t('member.user.table.columns.created_at'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_username',
        label: $t('member.user.search.username'),
        component: 'Input',
      },
      {
        fieldName: 'LIKE_nickname',
        label: $t('member.user.search.nickname'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_status',
        label: $t('member.user.search.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, clearable: true },
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('member.user.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'username',
        label: $t('member.user.form.username'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'nickname',
        label: $t('member.user.form.nickname'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'phone',
        label: $t('member.user.form.phone'),
        component: 'Input',
      },
      {
        fieldName: 'email',
        label: $t('member.user.form.email'),
        component: 'Input',
      },
      {
        fieldName: 'level_id',
        label: $t('member.user.form.level_id'),
        component: 'InputNumber',
      },
      {
        fieldName: 'status',
        label: $t('member.user.form.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    dialogWidth: '40%',
  }
}

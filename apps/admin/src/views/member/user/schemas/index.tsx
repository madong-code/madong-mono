import type { CrudSchema } from '#/components/crud/components/types'

import { MemberUserService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: MemberUserService.list,
    add: MemberUserService.create,
    edit: MemberUserService.update,
    remove: MemberUserService.remove,
    view: MemberUserService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'member:user:create',
      edit: 'member:user:update',
      remove: 'member:user:delete',
      view: 'member:user:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.user.table.columns.id'), minWidth: 60, visible: false },
      { field: 'nickname', title: $t('member.user.table.columns.nickname'), minWidth: 120 },
      { field: 'username', title: $t('member.user.table.columns.username'), minWidth: 120 },
      {
        field: 'avatar',
        title: $t('member.user.table.columns.avatar'),
        minWidth: 80,
        viewComponent: 'CellImage',
      },
      {
        field: 'level_id',
        title: $t('member.user.table.columns.level_id'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.MEMBER_LEVEL },
      },
      {
        field: 'status',
        title: $t('member.user.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_NORMAL_DISABLE },
      },
      { field: 'points', title: $t('member.user.table.columns.points'), minWidth: 80 },
      { field: 'balance', title: $t('member.user.table.columns.balance'), minWidth: 80 },
      { field: 'create_time', title: $t('member.user.table.columns.create_time'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_nickname',
        label: $t('member.user.search.nickname'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_status',
        label: $t('member.user.search.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_NORMAL_DISABLE, clearable: true },
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('member.user.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'nickname',
        label: $t('member.user.form.nickname'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'username',
        label: $t('member.user.form.username'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'avatar',
        label: $t('member.user.form.avatar'),
        component: 'Upload',
      },
      {
        fieldName: 'level_id',
        label: $t('member.user.form.level_id'),
        component: 'ApiSelect',
        componentProps: { code: DictEnum.MEMBER_LEVEL, clearable: true },
      },
      {
        fieldName: 'status',
        label: $t('member.user.form.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_NORMAL_DISABLE, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    title: $t('member.user.title'),
    width: 'w-[40%]',
  },
}

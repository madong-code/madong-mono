import type { CrudSchema } from '#/components/crud/components/types'

import { MemberLevelService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: MemberLevelService.list,
    add: MemberLevelService.create,
    edit: MemberLevelService.update,
    remove: MemberLevelService.remove,
    view: MemberLevelService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'member:level:create',
      edit: 'member:level:update',
      remove: 'member:level:delete',
      view: 'member:level:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.level.table.columns.id'), minWidth: 60, visible: false },
      { field: 'level', title: $t('member.level.table.columns.level'), minWidth: 100 },
      { field: 'name', title: $t('member.level.table.columns.name'), minWidth: 200 },
      { field: 'min_points', title: $t('member.level.table.columns.min_points'), minWidth: 100 },
      {
        field: 'discount',
        title: $t('member.level.table.columns.discount'),
        minWidth: 100,
        formatter: ({ row }: any) => `${row.discount}%`,
      },
      { field: 'member_count', title: $t('member.level.table.columns.member_count'), minWidth: 100 },
      {
        field: 'enabled',
        title: $t('member.level.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      {
        field: 'created_at',
        title: $t('member.level.table.columns.created_at'),
        minWidth: 160,
      },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('member.level.search.name'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_enabled',
        label: $t('member.level.search.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, clearable: true },
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('member.level.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'name',
        label: $t('member.level.form.name'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'level',
        label: $t('member.level.form.level'),
        component: 'InputNumber',
        rules: 'required',
        defaultValue: 1,
        componentProps: { min: 1, max: 9999, precision: 0 },
      },
      {
        fieldName: 'min_points',
        label: $t('member.level.form.min_points'),
        component: 'InputNumber',
        rules: 'required',
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'discount',
        label: $t('member.level.form.discount'),
        component: 'InputNumber',
        rules: 'required',
        componentProps: { min: 0, max: 100, precision: 0 },
      },
      {
        fieldName: 'icon',
        label: $t('member.level.form.icon'),
        component: 'IconPicker',
        componentProps: { class: 'w-full', clearable: true },
      },
      {
        fieldName: 'enabled',
        label: $t('member.level.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'description',
        label: $t('member.level.form.description'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    title: $t('member.level.title'),
    width: 'w-[40%]',
  },
}

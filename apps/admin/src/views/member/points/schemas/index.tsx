import type { CrudSchema } from '#/components/crud/components/types'

import { MemberPointsService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: MemberPointsService.list,
    add: MemberPointsService.create,
    edit: MemberPointsService.update,
    remove: MemberPointsService.remove,
    view: MemberPointsService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'member:points:create',
      edit: 'member:points:update',
      remove: 'member:points:delete',
      view: 'member:points:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.points.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('member.points.table.columns.name'), minWidth: 120 },
      { field: 'code', title: $t('member.points.table.columns.code'), minWidth: 100 },
      {
        field: 'type',
        title: $t('member.points.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.POINTS_TYPE },
      },
      { field: 'points', title: $t('member.points.table.columns.points'), minWidth: 80 },
      { field: 'icon', title: $t('member.points.table.columns.icon'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('member.points.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'create_time', title: $t('member.points.table.columns.create_time'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('member.points.search.name'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_type',
        label: $t('member.points.search.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.POINTS_TYPE, clearable: true },
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('member.points.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'name',
        label: $t('member.points.form.name'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'code',
        label: $t('member.points.form.code'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'type',
        label: $t('member.points.form.type'),
        component: 'ApiDict',
        rules: 'required',
        componentProps: { code: DictEnum.POINTS_TYPE, clearable: true },
      },
      {
        fieldName: 'points',
        label: $t('member.points.form.points'),
        component: 'InputNumber',
        rules: 'required',
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'icon',
        label: $t('member.points.form.icon'),
        component: 'IconPicker',
      },
      {
        fieldName: 'enabled',
        label: $t('member.points.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    title: $t('member.points.title'),
    width: 'w-[40%]',
  },
}

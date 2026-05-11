import type { CrudSchema } from '#/adapter/crud'

import { MemberPointsService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MemberPointsService.list,
      add: MemberPointsService.create,
      edit: MemberPointsService.update,
      remove: MemberPointsService.remove,
      view: MemberPointsService.get,
    },
    dialogTitle: $t('member.points.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'member:points:create',
    removeAuth: 'member:points:delete',
    editAuth: 'member:points:update',
    viewAuth: 'member:points:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.points.table.columns.id'), minWidth: 60, visible: false },
      { field: 'username', title: $t('member.points.table.columns.username'), minWidth: 100 },
      { field: 'nickname', title: $t('member.points.table.columns.nickname'), minWidth: 100 },
      {
        field: 'type',
        title: $t('member.points.table.columns.type'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.MEMBER_POINT_TYPE },
      },
      { field: 'points', title: $t('member.points.table.columns.points'), minWidth: 100 },
      { field: 'points_before', title: $t('member.points.table.columns.points_before'), minWidth: 100 },
      { field: 'points_after', title: $t('member.points.table.columns.points_after'), minWidth: 100 },
      {
        field: 'source',
        title: $t('member.points.table.columns.source'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.MEMBER_POINT_SOURCE },
      },
      { field: 'remark', title: $t('member.points.table.columns.remark'), minWidth: 160 },
      { field: 'operator', title: $t('member.points.table.columns.operator'), minWidth: 100 },
      { field: 'create_time', title: $t('member.points.table.columns.create_time'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_username',
        label: $t('member.points.search.username'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_type',
        label: $t('member.points.search.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.MEMBER_POINT_TYPE, clearable: true },
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('member.points.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'member_id',
        label: $t('member.points.form.member_id'),
        component: 'InputNumber',
        rules: 'required',
      },
      {
        fieldName: 'type',
        label: $t('member.points.form.type'),
        component: 'ApiDict',
        rules: 'required',
        componentProps: { code: DictEnum.MEMBER_POINT_TYPE, renderType: 'RadioGroup', isBtn: true },
      },
      {
        fieldName: 'points',
        label: $t('member.points.form.points'),
        component: 'InputNumber',
        rules: 'required',
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'remark',
        label: $t('member.points.form.remark'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    dialogWidth: '40%',
  }
}

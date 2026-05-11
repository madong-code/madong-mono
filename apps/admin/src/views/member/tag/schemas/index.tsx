import type { CrudSchema } from '#/adapter/crud'

import { MemberTagService } from '#/api/member'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MemberTagService.list,
      add: MemberTagService.create,
      edit: MemberTagService.update,
      remove: MemberTagService.remove,
      view: MemberTagService.get,
    },
    dialogTitle: $t('member.tag.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'member:tag:create',
    removeAuth: 'member:tag:delete',
    editAuth: 'member:tag:update',
    viewAuth: 'member:tag:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('member.tag.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('member.tag.table.columns.name'), minWidth: 120 },
      { field: 'color', title: $t('member.tag.table.columns.color'), minWidth: 80 },
      { field: 'member_count', title: $t('member.tag.table.columns.member_count'), minWidth: 100 },
      { field: 'sort', title: $t('member.tag.table.columns.sort'), minWidth: 80 },
      {
        field: 'status',
        title: $t('member.tag.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'create_time', title: $t('member.tag.table.columns.create_time'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_name',
        label: $t('member.tag.search.name'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('member.tag.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'name',
        label: $t('member.tag.form.name'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'color',
        label: $t('member.tag.form.color'),
        component: 'ColorPicker',
      },
      {
        fieldName: 'sort',
        label: $t('member.tag.form.sort'),
        component: 'InputNumber',
        defaultValue: 0,
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'status',
        label: $t('member.tag.form.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'description',
        label: $t('member.tag.form.description'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    dialogWidth: '40%',
  }
}

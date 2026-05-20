import type { CrudSchema } from '#/components/crud/components/types';
import { MemberPointsService } from '#/api/member';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MemberPointsService.list,
      add: MemberPointsService.create,
      edit: MemberPointsService.update as any,
      remove: MemberPointsService.remove as any,
      batchRemove: MemberPointsService.remove as any,
      view: MemberPointsService.get,
    },
    table: {
      hasAdd: true,
      hasEdit: false,
      hasView: true,
      hasRemove: false,
      permissions: { add: 'member:points:operate', view: 'member:points:read' },
      columns: [
        { type: 'checkbox', width: 60 },
        {
          field: 'member.username',
          title: $t('member.points.table.columns.username'),
          minWidth: 100,
        },
        {
          field: 'member.nickname',
          title: $t('member.points.table.columns.nickname'),
          minWidth: 100,
        },
        {
          field: 'type',
          title: $t('member.points.table.columns.type'),
          minWidth: 100,
          cellRender: { name: 'CellDictTag', attrs: { code: DictEnum.MEMBER_POINT_TYPE } },
        },
        { field: 'points', title: $t('member.points.table.columns.points'), minWidth: 100 },
        { field: 'balance', title: $t('member.points.table.columns.balance'), minWidth: 120 },
        {
          field: 'source',
          title: $t('member.points.table.columns.source'),
          minWidth: 150,
          cellRender: { name: 'CellDictTag', attrs: { code: DictEnum.MEMBER_POINT_SOURCE } },
        },
        { field: 'remark', title: $t('member.points.table.columns.remark'), minWidth: 200 },
        {
          field: 'created_at',
          title: $t('member.points.table.columns.create_time'),
          minWidth: 160,
          render: (row:any) => row.created_at?.format('YYYY-MM-DD HH:mm:ss') || '-' ,

        },
      ],
    },
    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'username',
          label: $t('member.points.table.search.username'),
        },
        {
          component: 'Input',
          fieldName: 'nickname',
          label: $t('member.points.table.search.nickname'),
        },
        {
          component: 'ApiDict',
          fieldName: 'type',
          label: $t('member.points.table.search.type'),
          componentProps: { code: DictEnum.MEMBER_POINT_TYPE, clearable: true },
        },
        {
          component: 'DatePicker',
          fieldName: 'date_range',
          label: $t('member.points.table.search.date_range'),
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: $t('member.points.title'),
      width: 'w-[40%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 120 },
      schema: [
        {
          fieldName: 'member_id',
          label: $t('member.points.form.member_id'),
          component: 'ApiSelect',
          rules: 'required',
          componentProps: {
            api: '/member/user',
            requestMethod: 'get',
            params: { format: 'select' },
          },
        },
        {
          fieldName: 'type',
          label: $t('member.points.form.type'),
          component: 'ApiDict',
          rules: 'required',
          componentProps: { code: DictEnum.MEMBER_POINT_TYPE },
        },
        {
          fieldName: 'points',
          label: $t('member.points.form.points'),
          component: 'InputNumber',
          defaultValue: 0,
          rules: 'required',
          componentProps: { min: 1 },
        },
        {
          fieldName: 'source',
          label: $t('member.points.form.source'),
          component: 'ApiDict',
          rules: 'required',
          componentProps: { code: DictEnum.MEMBER_POINT_SOURCE },
        },
        {
          fieldName: 'remark',
          label: $t('member.points.form.remark'),
          component: 'Input',
          componentProps: { type: 'textarea', rows: 3 },
        },
      ],
    },
  };
};

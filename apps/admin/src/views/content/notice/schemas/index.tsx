import type { CrudSchema } from '#/components/crud/components/types';

import { NoticeService } from '#/api/content/notice';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: NoticeService.list,
      add: NoticeService.create,
      edit: NoticeService.update,
      remove: NoticeService.delete,
      batchRemove: NoticeService.remove,
      view: NoticeService.get,
    },

    // ========== 扁平化表格配置 ==========
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    permissions: {
      add: 'system:notice:create',
      edit: 'system:notice:update',
      remove: 'system:notice:delete',
      view: 'system:notice:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'type',
        title: $t('setting.notice.table.columns.type'),
        width: 120,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_NOTICE_TYPE },
      },
      {
        field: 'title',
        title: $t('setting.notice.table.columns.title'),
        minWidth: 110,
        align: 'left',
      },
      {
        field: 'content',
        title: $t('setting.notice.table.columns.content'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'enabled',
        title: $t('setting.notice.table.columns.enabled'),
        width: 120,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_YES_NO },
      },
      {
        field: 'created_date',
        title: $t('setting.notice.table.columns.created_date'),
        minWidth: 160,
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_title',
          label: $t('setting.notice.table.search.title'),
          componentProps: {
            clearable: true,
            placeholder: $t('setting.notice.table.search.placeholder.title'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_type',
          label: $t('setting.notice.table.search.type'),
          componentProps: {
            code: DictEnum.SYS_NOTICE_TYPE,
            clearable: true,
            placeholder: $t('setting.notice.table.search.placeholder.type'),
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      title: $t('setting.notice.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelWidth: 100,
        labelAlign: 'right',
      },
      schema: [
        {
          label: $t('setting.notice.form.modal.id'),
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          label: $t('setting.notice.form.modal.type'),
          fieldName: 'type',
          component: 'ApiDict',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            code: DictEnum.SYS_NOTICE_TYPE,
          },
        },
        {
          label: $t('setting.notice.form.modal.title'),
          fieldName: 'title',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
        },
        {
          label: $t('setting.notice.form.modal.content'),
          fieldName: 'content',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            type: 'textarea',
            rows: 6,
          },
        },
        {
          label: $t('setting.notice.form.modal.enabled'),
          fieldName: 'enabled',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          componentProps: {
            code: DictEnum.SYS_YES_NO,
          },
        },
      ],
    },
  };
};

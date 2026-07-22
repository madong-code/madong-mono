import type { CrudSchema } from '#/components/crud/components/types';

import { DictTemplateService } from '#/api/template/dict';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: DictTemplateService.list,
      add: DictTemplateService.create,
      edit: DictTemplateService.update,
      remove: DictTemplateService.delete,
      batchRemove: DictTemplateService.batchRemove,
      view: DictTemplateService.get,
    },

    // ========== 扁平化表格配置 ==========
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    hasBatchRemove: true,
    permissions: {
      add: 'dict:template:create',
      edit: 'dict:template:update',
      remove: 'dict:template:delete',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'group_code',
        title: $t('template.dict.table.columns.group_code'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'name',
        title: $t('template.dict.table.columns.name'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'code',
        title: $t('template.dict.table.columns.code'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'data_type',
        title: $t('template.dict.table.columns.data_type'),
        minWidth: 100,
        align: 'left',
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_DICT_DATA_TYPE },
        },
      },
      {
        field: 'sort',
        title: $t('template.dict.table.columns.sort'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'enabled',
        title: $t('template.dict.table.columns.enabled'),
        minWidth: 100,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_ENABLED_STATUS },
        },
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'ApiDict',
          fieldName: 'EQ_group_code',
          label: $t('template.dict.table.search.group_code'),
          componentProps: {
            code: DictEnum.SYS_DICT_GROUP_CODE,
            clearable: true,
            placeholder: $t(
              'template.dict.table.search.placeholder.group_code',
            ),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('template.dict.table.search.name'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.dict.table.search.placeholder.name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('template.dict.table.search.code'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.dict.table.search.placeholder.code'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('template.dict.table.search.enabled'),
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            clearable: true,
            placeholder: $t('template.dict.table.search.placeholder.enabled'),
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      title: $t('template.dict.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelWidth: 100,
        labelAlign: 'right',
      },
      schema: [
        {
          label: $t('template.dict.form.modal.id'),
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          label: $t('template.dict.form.modal.group_code'),
          fieldName: 'group_code',
          component: 'ApiDict',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: { code: DictEnum.SYS_DICT_GROUP_CODE },
        },
        {
          label: $t('template.dict.form.modal.name'),
          fieldName: 'name',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('template.dict.form.modal.placeholder.name'),
          },
        },
        {
          label: $t('template.dict.form.modal.code'),
          fieldName: 'code',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('template.dict.form.modal.placeholder.code'),
          },
        },
        {
          label: $t('template.dict.form.modal.data_type'),
          fieldName: 'data_type',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          componentProps: {
            code: DictEnum.SYS_DICT_DATA_TYPE,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          label: $t('template.dict.form.modal.enabled'),
          fieldName: 'enabled',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          label: $t('template.dict.form.modal.sort'),
          fieldName: 'sort',
          component: 'InputNumber',
          defaultValue: 0,
          formItemClass: 'col-span-2',
        },
        {
          label: $t('template.dict.form.modal.description'),
          fieldName: 'description',
          component: 'Input',
          formItemClass: 'col-span-2',
          componentProps: {
            type: 'textarea',
            rows: 4,
            placeholder: $t('template.dict.form.modal.placeholder.description'),
          },
        },
      ],
    },
  };
};

import type { CrudSchema } from '#/components/crud/components/types';

import { DictItemTemplateService } from '#/api/template/dict-item';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: DictItemTemplateService.list,
      add: DictItemTemplateService.create,
      edit: DictItemTemplateService.update,
      remove: DictItemTemplateService.delete,
      batchRemove: DictItemTemplateService.batchRemove,
      view: DictItemTemplateService.get,
    },

    // ========== 扁平化表格配置 ==========
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    hasBatchRemove: true,
    permissions: {
      add: 'dict:item:template:create',
      edit: 'dict:item:template:update',
      remove: 'dict:item:template:delete',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'code',
        title: $t('template.dict-item.table.columns.code'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'label',
        title: $t('template.dict-item.table.columns.label'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'value',
        title: $t('template.dict-item.table.columns.value'),
        width: 120,
        align: 'left',
      },
      {
        field: 'sort',
        title: $t('template.dict-item.table.columns.sort'),
        width: 80,
        align: 'left',
      },
      {
        field: 'enabled',
        title: $t('template.dict-item.table.columns.enabled'),
        width: 80,
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
          component: 'Input',
          fieldName: 'LIKE_label',
          label: $t('template.dict-item.table.search.label'),
          componentProps: {
            clearable: true,
            placeholder: $t(
              'template.dict-item.table.search.placeholder.label',
            ),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_value',
          label: $t('template.dict-item.table.search.value'),
          componentProps: {
            clearable: true,
            placeholder: $t(
              'template.dict-item.table.search.placeholder.value',
            ),
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      title: $t('template.dict-item.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelWidth: 100,
        labelAlign: 'right',
      },
      schema: [
        {
          label: $t('template.dict-item.form.modal.id'),
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          label: $t('template.dict-item.form.modal.dict_template_id'),
          fieldName: 'dict_template_id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['dict_template_id'], show: false },
        },
        {
          label: $t('template.dict-item.form.modal.code'),
          fieldName: 'code',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['dict_template_id'], show: false },
        },
        {
          label: $t('template.dict-item.form.modal.color'),
          fieldName: 'color',
          component: 'ColorPicker',
          formItemClass: 'col-span-2',
        },
        {
          label: $t('template.dict-item.form.modal.label'),
          fieldName: 'label',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('template.dict-item.form.modal.placeholder.label'),
          },
        },
        {
          label: $t('template.dict-item.form.modal.value'),
          fieldName: 'value',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('template.dict-item.form.modal.placeholder.value'),
          },
        },
        {
          label: $t('template.dict-item.form.modal.other_class'),
          fieldName: 'other_class',
          component: 'Input',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t(
              'template.dict-item.form.modal.placeholder.other_class',
            ),
          },
        },
        {
          label: $t('template.dict-item.form.modal.enabled'),
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
          label: $t('template.dict-item.form.modal.sort'),
          fieldName: 'sort',
          component: 'InputNumber',
          defaultValue: 0,
          formItemClass: 'col-span-2',
          componentProps: { min: 0 },
        },
        {
          label: $t('template.dict-item.form.modal.remark'),
          fieldName: 'remark',
          component: 'Input',
          formItemClass: 'col-span-2',
          componentProps: {
            type: 'textarea',
            rows: 4,
            placeholder: $t('template.dict-item.form.modal.placeholder.remark'),
          },
        },
      ],
    },
  };
};

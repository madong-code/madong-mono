<template>
  <Page auto-content-height>
    <div class="dict-item-crud">
      <BasicCrud />
    </div>
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui'

import { useCrud } from '#/adapter/crud'
import type { CrudSchema } from '#/adapter/crud'
import { DictItemService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

const props = defineProps<{
  dictId: number | string
  dictCode: string
}>()

const crudSchemaDef = (): CrudSchema => {
  return {
    crudApi: {
      list: DictItemService.list,
      add: DictItemService.create,
      edit: DictItemService.update,
      remove: DictItemService.remove,
      view: DictItemService.get,
    },
    dialogTitle: $t('setting.dict.item.title'),
    dialogWidth: '40%',
    table: {
      hasAdd: true,
      hasEdit: true,
      hasView: true,
      hasRemove: true,
      permissions: {
        add: 'setting:dict:create',
        edit: 'setting:dict:update',
        remove: 'setting:dict:delete',
        view: 'setting:dict:read',
      },
      columns: [
        { type: 'checkbox', width: 60 },
        { field: 'id', title: $t('setting.dict.item.table.columns.id'), minWidth: 60, visible: false },
        { field: 'label', title: $t('setting.dict.item.table.columns.label'), minWidth: 120 },
        { field: 'value', title: $t('setting.dict.item.table.columns.value'), minWidth: 100 },
        { field: 'code', title: $t('setting.dict.item.table.columns.code'), minWidth: 100 },
        { field: 'sort', title: $t('setting.dict.item.table.columns.sort'), minWidth: 80 },
        {
          field: 'enabled',
          title: $t('setting.dict.item.table.columns.enabled'),
          minWidth: 80,
          viewComponent: 'ApiDict',
          viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
        },
        { field: 'remark', title: $t('setting.dict.item.table.columns.remark'), minWidth: 160 },
      ],
      beforeFetch: (params: any) => {
        params.EQ_dict_id = props.dictId
        return params
      },
    },
    formSchema: {
      enabled: true,
      schema: [
        { fieldName: 'id', label: $t('setting.dict.item.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
        { fieldName: 'dict_id', label: 'dict_id', component: 'Input', defaultValue: props.dictId, dependencies: { triggerFields: [], show: false } },
        { fieldName: 'code', label: $t('setting.dict.item.form.code'), component: 'Input', defaultValue: props.dictCode },
        {
          fieldName: 'label',
          label: $t('setting.dict.item.form.label'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'value',
          label: $t('setting.dict.item.form.value'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'sort',
          label: $t('setting.dict.item.form.sort'),
          component: 'InputNumber',
          defaultValue: 0,
          componentProps: { min: 0, precision: 0 },
        },
        {
          fieldName: 'enabled',
          label: $t('setting.dict.item.form.enabled'),
          component: 'ApiDict',
          componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
          defaultValue: 1,
        },
        {
          fieldName: 'remark',
          label: $t('setting.dict.item.form.remark'),
          component: 'Input',
          componentProps: { type: 'textarea', rows: 3 },
        },
      ],
      transformFormValues: (values: Record<string, any>) => {
        values.dict_id = props.dictId
        return values
      },
    },
  }
}

const [BasicCrud] = useCrud(crudSchemaDef())
</script>

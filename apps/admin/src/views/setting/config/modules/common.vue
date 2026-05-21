<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

<script setup lang="ts">
import { useCrud, type CrudSchema } from '#/adapter/crud'
import { ConfigService } from '#/api/setting/config'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'
import { Page } from '#/components/page'

const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: (params: any) =>
        ConfigService.getItems({ ...params, groupCode: 'common' }),
      add: (params: any) => {
        const { group_code, code, name, content, remark } = params
        return ConfigService.save({ group_code, code, name, content, remark })
      },
      edit: (params: any) => {
        const { group_code, code, name, content, remark, enabled } = params
        return ConfigService.update(code, { group_code, code, name, content, remark, enabled })
      },
      remove: (params: any) => {
        const codes = params.codes || params.code
        if (Array.isArray(codes)) {
          return Promise.all(codes.map((c: string) => ConfigService.delete(c)))
        }
        return ConfigService.delete(codes)
      },
      batchRemove: () => Promise.resolve(),
      view: ConfigService.getByCode as any,
    },

    // ========== 扁平化表格配置 ==========
    rowKey: 'code',
    hasAdd: false,
    hasEdit: false,
    hasView: false,
    hasRemove: false,
    columns: [
      { field: 'name', title: $t('setting.config.common.columns.name'), width: 180 },
      { field: 'code', title: $t('setting.config.common.columns.code'), width: 200 },
      { field: 'content', title: $t('setting.config.common.columns.content'), minWidth: 250 },
      {
        field: 'enabled',
        title: $t('setting.config.common.columns.enabled'),
        width: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'updated_at', title: $t('setting.config.common.columns.updated_at'), minWidth: 170 },
    ],

    searchForm: {
    enabled: true,
    collapsed: true,
    collapsedRows: 2,
    schema: [
      {
        component: 'Input',
        fieldName: 'keyword',
        label: '',
        componentProps: {
          placeholder: $t('setting.config.common.search.keyword'),
        },
      },
    ],
  },

  formDialog: {
    enabled: true,
    title: $t('setting.config.common.title'),
    width: 'w-[50%]',
    wrapperClass: 'grid-cols-1',
    commonConfig: { labelWidth: 100, labelAlign: 'right' },
    schema: [
      {
        fieldName: 'code',
        label: $t('setting.config.common.form.code'),
        component: 'Input',
        rules: 'required',
        componentProps: { placeholder: $t('setting.config.common.form.placeholder.code') },
      },
      {
        fieldName: 'name',
        label: $t('setting.config.common.form.name'),
        component: 'Input',
        rules: 'required',
        componentProps: { placeholder: $t('setting.config.common.form.placeholder.name') },
      },
      {
        fieldName: 'content',
        label: $t('setting.config.common.form.content'),
        component: 'Input',
        componentProps: {
          type: 'textarea',
          rows: 10,
          placeholder: $t('setting.config.common.form.placeholder.content'),
        },
      },
      {
        fieldName: 'enabled',
        label: $t('setting.config.common.form.enabled'),
        component: 'ApiDict',
        defaultValue: 1,
        componentProps: {
          code: DictEnum.SYS_ENABLED_STATUS,
          renderType: 'RadioGroup',
          isBtn: true,
        },
      },
      {
        fieldName: 'remark',
        label: $t('setting.config.common.form.remark'),
        component: 'Input',
        componentProps: {
          type: 'textarea',
          rows: 3,
          placeholder: $t('setting.config.common.form.placeholder.remark'),
        },
      },
    ],
  },
})

const [BasicCrud] = useCrud(useCrudSchema())
</script>

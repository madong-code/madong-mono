<script setup lang="ts">
import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import DictItemWrap from './dict-item-wrap.vue';
import { useCrudSchema } from './schemas';

const dictItemWrapRef = ref();

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  hasEdit: false,
  hasRemove: false,
  tableActions: [
    {
      label: $t('template.dict.table_actions.dict_item'),
      type: 'primary',
      link: true,
      icon: 'ant-design:setting-outlined',
      auth: 'dict:item:template:read',
      onClick: (_action: any, row: any) => {
        dictItemWrapRef.value?.show(row);
      },
    },
  ],
  dropDownActions: [
    {
      label: $t('template.dict.drop_down_actions.edit'),
      type: 'primary',
      link: true,
      icon: 'ant-design:edit-outlined',
      auth: 'dict:template:update',
      onClick: (_action: any, row: any) => {
        crudApi.openEditDialog(row);
      },
    },
    {
      label: $t('template.dict.drop_down_actions.delete'),
      type: 'danger',
      icon: 'ant-design:delete-outlined',
      auth: 'dict:template:delete',
      onClick: (_action: any, _record: any) => {
        crudApi.executeRemove(_record);
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <DictItemWrap ref="dictItemWrapRef" />
  </Page>
</template>

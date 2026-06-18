<script setup lang="ts">
import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import InterfaceListSelector from './initerface-list.vue';
import { useCrudSchema } from './schemas';

const interfaceListSelectorRef = ref();

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: $t('system.menu.template.api.title'),
      type: 'primary',
      link: true,
      sort: 999,
      icon: 'ant-design:link-outlined',
      onClick: (_e: any, row: any) => {
        interfaceListSelectorRef.value?.show({
          data: row,
          getCrudApi: () => crudApi,
        });
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <InterfaceListSelector
      ref="interfaceListSelectorRef"
      @success="crudApi?.refreshCreate()"
    />
  </Page>
</template>

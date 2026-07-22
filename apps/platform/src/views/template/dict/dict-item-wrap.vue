<script setup lang="ts">
import { ref } from 'vue';

import { useCrud } from '#/adapter/crud';
import { useDialog } from '#/components/dialog';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import { useCrudSchema } from '../dict-item/schemas';

const record = ref<any>(null);

const [Drawer, drawerApi] = useDialog({
  dialogType: 'drawer',
  width: '60%',
  destroyOnClose: true,
  zIndex: 999,
  footer: false,
});

const schema = useCrudSchema();
const [BasicCrud] = useCrud({
  ...schema,
  formDialog: {
    ...schema.formDialog,
    showFooter: false,
    transformFormValues: (values, type) => {
      if (type === 'add') {
        values.dict_template_id = record.value?.id;
        values.code = record.value?.code;
      }
      return values;
    },
  },
  beforeFetch: (params) => ({
    ...params,
    dict_template_id: record.value?.id,
  }),
});

const show = (row: any) => {
  record.value = row;
  drawerApi.setState({
    title: `${$t('template.dict-item.title')} - ${row.name}`,
  });
  drawerApi.open();
};

defineExpose({ show });
</script>
<template>
  <Drawer>
    <Page auto-content-height>
      <BasicCrud v-if="record.id" />
    </Page>
  </Drawer>
</template>

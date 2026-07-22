<script setup lang="ts">
import { ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { ConfigTemplateService } from '#/api/template/config';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import ConfigForm from './components/config-form.vue';
import { useCrudSchema } from './schemas';

const formVisible = ref(false);
const editingRow = ref<any>(null);

const handleAdd = () => {
  editingRow.value = null;
  formVisible.value = true;
};

const handleEdit = (row: any) => {
  editingRow.value = row;
  formVisible.value = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    $t('common.confirm_dialog.delete'),
    $t('common.message.tips'),
    { type: 'warning' },
  )
    .then(async () => {
      await ConfigTemplateService.delete(row.id);
      ElMessage.success($t('common.message.success'));
      crudApi.refreshData();
    })
    .catch(() => {});
};

const schema = useCrudSchema();

// 操作栏定义在页面层，方便直接引用本页的 handler
schema.toolbarActions = [
  {
    key: 'add',
    label: $t('common.crud.add'),
    type: 'primary' as const,
    sort: -1,
    icon: 'ant-design:plus-outlined',
    auth: 'config-template:create',
    onClick: handleAdd,
  },
];

schema.tableActions = [
  {
    key: 'edit',
    label: $t('common.crud.edit'),
    type: 'primary' as const,
    link: true,
    icon: 'ant-design:edit-outlined',
    auth: 'config-template:update',
    onClick: (_action: any, record: any) => handleEdit(record),
  },
];

schema.dropDownActions = [
  {
    key: 'delete',
    label: $t('common.crud.delete'),
    type: 'danger' as const,
    icon: 'ant-design:delete-outlined',
    auth: 'config-template:delete',
    onClick: (_action: any, record: any) => handleDelete(record),
  },
];

const [BasicCrud, crudApi] = useCrud(schema);

const handleSaved = () => {
  crudApi.refreshData();
};
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <ConfigForm
      v-model:visible="formVisible"
      :row="editingRow"
      @saved="handleSaved"
    />
  </Page>
</template>

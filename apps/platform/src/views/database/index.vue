<script setup lang="ts">
import { ElMessage } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { DbSettingService } from '#/api/database';
import { $t } from '#/locales';

import { useCrudSchema } from './schemas';

const handleTestConnection = async (row: any) => {
  try {
    const res = await DbSettingService.testConnection(row.id);
    const data = res?.data ?? res;
    if (data?.success) {
      ElMessage.success(
        `${$t('database.action.connection_success')}：${data.message || ''}`,
      );
    } else {
      ElMessage.error(
        `${$t('database.action.connection_fail')}：${
          data?.message || $t('database.action.connection_unknown_error')
        }`,
      );
    }
  } catch (error: any) {
    ElMessage.error(
      error?.message || $t('database.action.test_connection_fail'),
    );
  }
};

const [BasicCrud] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: $t('database.action.test_connection'),
      type: 'primary',
      link: true,
      auth: 'platform:database:setting:test',
      icon: 'ant-design:sync-outlined',
      onClick: (_e: any, row: any) => handleTestConnection(row),
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

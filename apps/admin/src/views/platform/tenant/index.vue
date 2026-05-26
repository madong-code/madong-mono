<template>
  <Page auto-content-height>
    <BasicCrud />
    <GrantPlanDrawer />
  </Page>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';

import { TenantService } from '#/api/platform/tenant';
import { useCrud } from '#/adapter/crud';
import { useCrudSchema } from './schemas';
import GrantPlan from './components/grant-plan.vue';
import { Page } from '@vben/common-ui';

const [GrantPlanDrawer, grantPlanDrawerApi] = useVbenDrawer({
  connectedComponent: GrantPlan,
});

const handleSyncData = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要同步租户「${row.name}」的数据吗？\n同步将重新应用关联套餐的权限和配置。`,
      '同步数据确认',
      { confirmButtonText: '确定同步', cancelButtonText: '取消', type: 'warning' },
    );
    await TenantService.syncData(row.id);
    ElMessage.success('数据同步成功');
    crudApi.query();
  } catch (e: any) {
    if (e !== 'cancel' && e?.message) {
      ElMessage.error(e.message || '同步失败');
    }
  }
};

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: '授权套餐',
      type: 'primary',
      link: true,
      icon: 'ant-design:link-outlined',
      onClick: (_e: any, row: any) => {
        grantPlanDrawerApi.setData({ row, onSuccess: () => crudApi.query() }).open();
      },
    },
    {
      label: '同步数据',
      type: 'primary',
      link: true,
      icon: 'ant-design:sync-outlined',
      onClick: (_e: any, row: any) => handleSyncData(row),
    },
  ],
});
</script>

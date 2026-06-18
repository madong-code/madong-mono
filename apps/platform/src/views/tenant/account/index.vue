<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { TenantService } from '#/api/tenant/account';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import GrantPlan from './components/grant-plan.vue';
import TenantMemberWarp from './components/tenant-member-warp.vue';
import { useCrudSchema } from './schemas';

const [GrantPlanDrawer, grantPlanDrawerApi] = useVbenDrawer({
  connectedComponent: GrantPlan,
});

const [TenantMemberDrawer, tenantMemberDrawerApi] = useVbenDrawer({
  connectedComponent: TenantMemberWarp,
});

const handleSyncData = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      $t('tenant.account.message.sync_confirm', [row.name]),
      $t('tenant.account.message.sync_confirm_title'),
      {
        confirmButtonText: $t('tenant.account.message.sync_confirm_btn'),
        cancelButtonText: $t('tenant.account.message.sync_cancel_btn'),
        type: 'warning',
      },
    );
    await TenantService.syncData(row.id);
    ElMessage.success($t('tenant.account.message.sync_success'));
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message) {
      ElMessage.error(
        error.message || $t('tenant.account.message.sync_failed'),
      );
    }
  }
};

const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: $t('tenant.account.action.grant_plan'),
      type: 'primary',
      link: true,
      icon: 'ant-design:link-outlined',
      onClick: (_e: any, row: any) => {
        grantPlanDrawerApi
          .setData({ row, onSuccess: () => crudApi.query() })
          .open();
      },
    },
    {
      label: $t('tenant.account.action.sync_data'),
      type: 'primary',
      link: true,
      icon: 'ant-design:sync-outlined',
      onClick: (_e: any, row: any) => handleSyncData(row),
    },
    {
      label: $t('tenant.account.action.tenant_member'),
      type: 'primary',
      link: true,
      icon: 'ant-design:team-outlined',
      onClick: (_e: any, row: any) => {
        tenantMemberDrawerApi
          .setData({ record: { tenantId: row.id, tenantName: row.name } })
          .open();
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <GrantPlanDrawer />
    <TenantMemberDrawer />
  </Page>
</template>

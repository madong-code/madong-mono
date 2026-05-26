<template>
  <Page auto-content-height>
    <BasicCrud />
    <BindTenantDrawer />
    <AuthDrawer />
  </Page>
</template>

<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';

import { useCrud } from '#/adapter/crud';
import { useCrudSchema } from './schemas';
import GrantAuth from './components/grant-auth.vue';
import GrantTenant from './components/grant-tenant.vue';

// ===== 抽屉（组件抽离模式）=====
const [BindTenantDrawer, bindTenantDrawerApi] = useVbenDrawer({
  connectedComponent: GrantTenant,
});

const [AuthDrawer, authDrawerApi] = useVbenDrawer({
  connectedComponent: GrantAuth,
});

// ===== CRUD =====
const [BasicCrud, crudApi] = useCrud(useCrudSchema({
  bindTenantDrawerApi,
  authDrawerApi,
  onRefresh: () => crudApi.query(),
}));
</script>

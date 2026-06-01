<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import TenantMemberIndex from '../../member/index.vue';

const emit = defineEmits<{ reload: [] }>();

const currentTenant = ref<{ id: number | string; name?: string }>({});

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{
        record: { tenantId: number | string; tenantName?: string };
      }>();
      currentTenant.value = {
        id: data?.record?.tenantId ?? '',
        name: data?.record?.tenantName ?? '',
      };
    }
  },
});

function onChildReload() {
  emit('reload');
}
</script>

<template>
  <Drawer :footer="false" class="w-[80%]" title="租户成员">
    <template #extra>
      <span class="text-sm text-gray-400" v-if="currentTenant.name">
        租户：{{ currentTenant.name }}
      </span>
    </template>
    <TenantMemberIndex
      v-if="currentTenant.id"
      :key="currentTenant.id"
      :tenant-id="currentTenant.id"
      :tenant-name="currentTenant.name"
      @reload="onChildReload"
    />
  </Drawer>
</template>

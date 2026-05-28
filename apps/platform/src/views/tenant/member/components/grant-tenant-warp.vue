<script setup lang="ts">
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import TenantMemberAdminIndex from '#/views/tenant/member-admin/index.vue';

const emit = defineEmits<{ reload: [] }>();

const record = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose:true,
  onOpenChange(isOpen) {
    record.value = isOpen ? drawerApi.getData()?.record : {};
  },
});

function onRefresh() {
  emit('reload');
}
</script>

<template>
  <Drawer :footer="false" class="w-[65%]" title="管理租户">
    <TenantMemberAdminIndex
      v-if="record?.adminId"
      :key="record.adminId"
      :admin-id="record.adminId"
      :admin-name="record.adminName"
      @reload="onRefresh"
    />
  </Drawer>
</template>

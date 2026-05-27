<script setup lang="ts">
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import TenantMemberAdminIndex from '#/views/tenant/member-admin/index.vue';

const emit = defineEmits<{ reload: [] }>();

const adminId = ref<number>(0);
const adminNameVal = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData() as any;
      adminId.value = data?.adminId || 0;
      adminNameVal.value = data?.adminName || '';
    }
  },
  // 不设置 destroyOnClose，由外层 Drawer 统一管理生命周期
  // 否则内层关闭会触发外层 reCreateDrawer，导致级联销毁重建
  title: '管理租户',
  class: 'w-[65%]',
  footer: false,
});

function onRefresh() {
  emit('reload');
}
</script>

<template>
  <Drawer>
    <TenantMemberAdminIndex
      v-if="adminId"
      :admin-id="adminId"
      :admin-name="adminNameVal"
      @reload="onRefresh"
    />
  </Drawer>
</template>

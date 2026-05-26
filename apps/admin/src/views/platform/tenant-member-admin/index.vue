<script setup lang="ts">
import { computed } from 'vue';
import { useCrud } from '#/adapter/crud';
import { useCrudAdminSchema } from './schemas';
import { Page } from '@vben/common-ui';


const props = defineProps<{
  adminId?: number | string;
  adminName?: string;
}>();

const emit = defineEmits<{ reload: [] }>();

const adminId = computed(() => Number(props.adminId) || 0);


const [BasicCrud] = useCrud({
  ...useCrudAdminSchema(),
  beforeFetch: (params: any) => ({ ...params, admin_id: adminId.value }), 
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

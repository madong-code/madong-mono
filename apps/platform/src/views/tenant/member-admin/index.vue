<script setup lang="ts">
import { ref } from 'vue';
import { useCrud } from '#/adapter/crud';
import { useCrudAdminSchema } from './schemas';
import { Page } from '#/components/page';
import MemberAdminFormModal from './modal.vue';

const props = defineProps<{
  adminId?: number | string;
  adminName?: string;
}>();

const emit = defineEmits<{ reload: [] }>();

const adminIdNum = Number(props.adminId) || 0;


const [BasicCrud, crudApi] = useCrud({
  ...useCrudAdminSchema(),
  beforeFetch: (params: any) => ({ ...params, admin_id: adminIdNum }),
  toolbarActions: [
    {
      label: '新增',
      type: 'primary',
      icon: 'ant-design:plus-outlined',
      onClick: () => formModalRef.value?.openAdd(adminIdNum),
    },
  ],
});

const formModalRef = ref<InstanceType<typeof MemberAdminFormModal>>();

function onSuccess() {
  crudApi.query();
  emit('reload');
}
</script>

<template>
  <Page auto-content-height>
    <BasicCrud />
    <MemberAdminFormModal ref="formModalRef" @success="onSuccess" />
  </Page>
</template>

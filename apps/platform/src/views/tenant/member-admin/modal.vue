<script setup lang="ts">
import { ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { TenantMemberAdminApi } from '#/api/tenant/member-admin';
import { TenantService } from '#/api/tenant/account';
import { formSchamas } from './schemas/form';

const emit = defineEmits<{ success: [] }>();

const isUpdate = ref(false);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 100,
    componentProps: { class: 'w-full' },
  },
  schema: formSchamas(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  async onOpenChange(isOpen) {
    if (!isOpen) return;

    isUpdate.value = false;
    const data = modalApi.getData<Record<string, any>>();
    const adminId = data?.admin_id || 0;

    formApi.setFieldValue('admin_id', adminId);

    // 编辑模式：获取详情回填
    if (data?.is_update && data?.id) {
      isUpdate.value = true;
      try {
        const info = await TenantMemberAdminApi.get(data.id);
        formApi.setValues(info);
      } catch {
        // ignore
      }
    }

    // 加载租户选项（排除已分配的）
    await fetchTenantSelect(adminId);
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.setState({ loading: true, confirmLoading: true });
    try {
      const values = await formApi.getValues();
      if (isUpdate.value) {
        await TenantMemberAdminApi.update(values);
      } else {
        await TenantMemberAdminApi.create(values);
      }
      ElMessage.success(isUpdate.value ? '编辑成功' : '新增成功');
      modalApi.close();
      emit('success');
    } catch {
      // error handled globally
    } finally {
      modalApi.setState({ loading: false, confirmLoading: false });
    }
  },
});

async function fetchTenantSelect(adminId: number) {
  try {
    const res = await TenantService.list({ format: 'select', limit: 9999, admin_id: adminId });
    const options = Array.isArray(res) ? res : [];
    formApi.updateSchema([
      {
        fieldName: 'tenant_id',
        componentProps: {
          options,
          filterable: true,
          placeholder: '请选择租户（可搜索）',
        },
      },
    ]);
  } catch {
    // ignore
  }
}

function openAdd(adminId: number) {
  isUpdate.value = false;
  formApi.resetForm();
  modalApi.setData({ admin_id: adminId }).open();
}

function openEdit(row: Record<string, any>) {
  isUpdate.value = true;
  formApi.resetForm();
  modalApi.setData({ ...row, is_update: true }).open();
}

defineExpose({ openAdd, openEdit });
</script>

<template>
  <Modal :title="isUpdate ? '编辑' : '新增'">
    <div class="p-4">
      <Form />
    </div>
  </Modal>
</template>

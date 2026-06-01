<script setup lang="ts">
import type { TenantMemberRow } from '#/api/tenant/member-for-tenant';

import { computed } from 'vue';

import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { TenantMemberApi } from '#/api/tenant/member-for-tenant';
import { Page } from '#/components/page';

import { useCrudSchema } from './schemas';

const props = defineProps<{
  tenantId: number | string;
  tenantName?: string;
}>();

const api = computed(() => TenantMemberApi(props.tenantId));

// ---- 切换状态 ----
const handleStatusChange = async (
  row: TenantMemberRow,
  newVal: boolean | number | string,
) => {
  try {
    const statusText = newVal ? '启用' : '禁用';
    await ElMessageBox.confirm(
      `确定要${statusText}用户「${row.real_name}」吗？`,
      `${statusText}确认`,
      { type: 'warning' },
    );
    await api.value.changStatus(row.id, Number(newVal));
    ElMessage.success(`已${statusText}`);
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message) ElMessage.error(error.message || '操作失败');
  }
};

// ---- 锁定 ----
const handleLock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      `确定要锁定用户「${row.real_name}」吗？`,
      '锁定确认',
      {
        type: 'warning',
      },
    );
    await api.value.locked(row.id);
    ElMessage.success('已锁定');
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message) ElMessage.error(error.message || '锁定失败');
  }
};

// ---- 解锁 ----
const handleUnlock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      `确定要解锁用户「${row.real_name}」吗？`,
      '解锁确认',
      {
        type: 'warning',
      },
    );
    await api.value.unLocked(row.id);
    ElMessage.success('已解锁');
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message) ElMessage.error(error.message || '解锁失败');
  }
};

// ---- 重置密码 ----
const handleResetPwd = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户「${row.real_name}」的密码吗？密码将重置为 123456`,
      '重置密码确认',
      { type: 'warning' },
    );
    await api.value.resetPassword(row.id);
    ElMessage.success('密码已重置');
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message) ElMessage.error(error.message || '重置失败');
  }
};

// ---- CRUD ----
const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(api.value),
  dropDownActions: [
    {
      label: '锁定',
      type: 'warning',
      link: true,
      icon: 'ant-design:lock-outlined',
      ifShow: (_e: any, record: any) => Number(record.is_locked) !== 1,
      onClick: (_e: any, record: any) => handleLock(record),
    },
    {
      label: '解锁',
      type: 'success',
      link: true,
      icon: 'ant-design:unlock-outlined',
      ifShow: (_e: any, record: any) => Number(record.is_locked) === 1,
      onClick: (_e: any, record: any) => handleUnlock(record),
    },
    {
      label: '重置密码',
      type: 'primary',
      link: true,
      icon: 'ant-design:key-outlined',
      onClick: (_e: any, record: any) => handleResetPwd(record),
    },
    {
      label: '删除',
      type: 'danger',
      link: true,
      icon: 'ant-design:delete-outlined',
      onClick: (_e: any, record: any) => {
        crudApi.executeRemove(record);
      },
    },
  ],
});
</script>

<template>
  <Page auto-content-height>
    <BasicCrud>
      <!-- 状态开关列 -->
      <template #enabled_switch="{ row }">
        <ElSwitch
          :model-value="!!row.enabled"
          @change="
            (val: string | number | boolean) => handleStatusChange(row, val)
          "
        />
      </template>
    </BasicCrud>
  </Page>
</template>

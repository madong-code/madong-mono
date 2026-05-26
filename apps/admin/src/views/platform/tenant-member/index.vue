<script setup lang="ts">
import { ElMessage, ElMessageBox, ElSwitch, ElTag } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';

import { TenantMemberApi } from '#/api/platform/tenant-member-admin';
import type { TenantMemberRow } from '#/api/platform/tenant-member-admin';
import { useCrud } from '#/adapter/crud';
import { useCrudSchema } from './schemas';
import GrantTenantWrap from './components/grant-tenant-warp.vue';
import { Page } from '@vben/common-ui';

// ---- 租户分配 Drawer ----
// destroyOnClose 不能设为 true，否则会透传到内层 Drawer 的 mergedOptions
// 导致内层关闭时触发 reCreateDrawer 销毁重建组件树，破坏 KeepAlive 状态
const [UserTenantDrawer, userTenantDrawerApi] = useVbenDrawer({
  connectedComponent: GrantTenantWrap,
  destroyOnClose: false,
});

// ---- 切换状态 ----
const handleStatusChange = async (row: TenantMemberRow, newVal: string | number | boolean) => {
  try {
    const statusText = newVal ? '启用' : '禁用';
    await ElMessageBox.confirm(
      `确定要${statusText}用户「${row.real_name}」吗？`,
      `${statusText}确认`,
      { type: 'warning' },
    );
    await TenantMemberApi.changStatus(row.id, Number(newVal));
    ElMessage.success(`已${statusText}`);
    crudApi.query();
  } catch (e: any) {
    if (e !== 'cancel' && e?.message) ElMessage.error(e.message || '操作失败');
  }
};

// ---- 锁定 ----
const handleLock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(`确定要锁定用户「${row.real_name}」吗？`, '锁定确认', {
      type: 'warning',
    });
    await TenantMemberApi.locked(row.id);
    ElMessage.success('已锁定');
    crudApi.query();
  } catch (e: any) {
    if (e !== 'cancel' && e?.message) ElMessage.error(e.message || '锁定失败');
  }
};

// ---- 解锁 ----
const handleUnlock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(`确定要解锁用户「${row.real_name}」吗？`, '解锁确认', {
      type: 'warning',
    });
    await TenantMemberApi.unLocked(row.id);
    ElMessage.success('已解锁');
    crudApi.query();
  } catch (e: any) {
    if (e !== 'cancel' && e?.message) ElMessage.error(e.message || '解锁失败');
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
    await TenantMemberApi.resetPassword(row.id);
    ElMessage.success('密码已重置');
    crudApi.query();
  } catch (e: any) {
    if (e !== 'cancel' && e?.message) ElMessage.error(e.message || '重置失败');
  }
};

// ---- 管理租户 ----
const handleManagedTenants = (row: TenantMemberRow) => {
  userTenantDrawerApi.setData({ adminId: row.id, adminName: row.real_name }).open();
};

// ---- 获取租户标签颜色 ----
const getTenantColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return `hsl(${hash % 360}, 70%, 50%)`;
};

// ---- CRUD with dropDownActions ----
const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(),
  dropDownActions: [
    {
      label: '管理租户',
      type: 'primary',
      link: true,
      icon: 'ant-design:apartment-outlined',
      show: (row: any) => row.is_super !== 1,
      onClick: (_e: any, row: any) => handleManagedTenants(row),
    },
    {
      label: '锁定',
      type: 'warning',
      link: true,
      icon: 'ant-design:lock-outlined',
      show: (row: any) => row.is_super !== 1 && row.is_locked !== 1,
      onClick: (_e: any, row: any) => handleLock(row),
    },
    {
      label: '解锁',
      type: 'success',
      link: true,
      icon: 'ant-design:unlock-outlined',
      show: (row: any) => row.is_super !== 1 && row.is_locked === 1,
      onClick: (_e: any, row: any) => handleUnlock(row),
    },
    {
      label: '重置密码',
      type: 'primary',
      link: true,
      icon: 'ant-design:key-outlined',
      show: (row: any) => row.is_super !== 1,
      onClick: (_e: any, row: any) => handleResetPwd(row),
    },
  ],
});
</script>

<template>
    <Page auto-content-height>
    <BasicCrud>
      <!-- 管理租户列 -->
      <template #managed_tenants="{ row }">
        <div v-if="row.is_super === 1">
          <ElTag style=" color: #fff;background-color: #1677ff" size="small">ALL</ElTag>
        </div>
        <div v-else class="flex gap-[4px] flex-wrap">
          <ElTag
            v-for="(item, idx) in (row.managed_tenants || [])"
            :key="item.id || idx"
            :style="{ backgroundColor: getTenantColor(item.company_name || ''), color: '#fff' }"
            size="small"
          >
            {{ item.company_name || '' }}
          </ElTag>
        </div>
      </template>

      <!-- 状态开关列 -->
      <template #enabled_switch="{ row }">
        <ElSwitch
          :model-value="!!row.enabled"
          :disabled="row.is_super === 1"
          @change="(val: string | number | boolean) => handleStatusChange(row, val)"
        />
      </template>
    </BasicCrud>

    <!-- 租户分配 Drawer -->
    <UserTenantDrawer @reload="crudApi.query()" />
  </Page>
</template>

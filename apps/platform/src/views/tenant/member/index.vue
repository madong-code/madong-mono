<script setup lang="ts">
import type { TenantMemberRow } from '#/api/tenant/member-for-tenant';

import { computed } from 'vue';

import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus';

import { useCrud } from '#/adapter/crud';
import { TenantMemberApi } from '#/api/tenant/member-for-tenant';
import { Page } from '#/components/page';
import { $t } from '#/locales';

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
    const statusText = newVal
      ? $t('tenant.member.options.enabled.enable')
      : $t('tenant.member.options.enabled.disable');
    await ElMessageBox.confirm(
      $t('tenant.member.message.status_change_confirm', [
        statusText,
        row.real_name,
      ]),
      $t('tenant.member.message.status_change_title', [statusText]),
      { type: 'warning' },
    );
    await api.value.changStatus(row.id, Number(newVal));
    ElMessage.success(
      $t('tenant.member.message.status_change_success', [statusText]),
    );
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message)
      ElMessage.error(
        error.message || $t('tenant.member.message.status_change_failed'),
      );
  }
};

// ---- 锁定 ----
const handleLock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      $t('tenant.member.message.lock_confirm', [row.real_name]),
      $t('tenant.member.message.lock_title'),
      {
        type: 'warning',
      },
    );
    await api.value.locked(row.id);
    ElMessage.success($t('tenant.member.message.lock_success'));
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message)
      ElMessage.error(error.message || $t('tenant.member.message.lock_failed'));
  }
};

// ---- 解锁 ----
const handleUnlock = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      $t('tenant.member.message.unlock_confirm', [row.real_name]),
      $t('tenant.member.message.unlock_title'),
      {
        type: 'warning',
      },
    );
    await api.value.unLocked(row.id);
    ElMessage.success($t('tenant.member.message.unlock_success'));
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message)
      ElMessage.error(
        error.message || $t('tenant.member.message.unlock_failed'),
      );
  }
};

// ---- 重置密码 ----
const handleResetPwd = async (row: TenantMemberRow) => {
  try {
    await ElMessageBox.confirm(
      $t('tenant.member.message.reset_pwd_confirm', [row.real_name]),
      $t('tenant.member.message.reset_pwd_title'),
      { type: 'warning' },
    );
    await api.value.resetPassword(row.id);
    ElMessage.success($t('tenant.member.message.reset_pwd_success'));
    crudApi.query();
  } catch (error: any) {
    if (error !== 'cancel' && error?.message)
      ElMessage.error(
        error.message || $t('tenant.member.message.reset_pwd_failed'),
      );
  }
};

// ---- CRUD ----
const [BasicCrud, crudApi] = useCrud({
  ...useCrudSchema(api.value),
  dropDownActions: [
    {
      label: $t('tenant.member.action.lock'),
      type: 'warning',
      link: true,
      icon: 'ant-design:lock-outlined',
      ifShow: (_e: any, record: any) => Number(record.is_locked) !== 1,
      onClick: (_e: any, record: any) => handleLock(record),
    },
    {
      label: $t('tenant.member.action.unlock'),
      type: 'success',
      link: true,
      icon: 'ant-design:unlock-outlined',
      ifShow: (_e: any, record: any) => Number(record.is_locked) === 1,
      onClick: (_e: any, record: any) => handleUnlock(record),
    },
    {
      label: $t('tenant.member.action.reset_password'),
      type: 'primary',
      link: true,
      icon: 'ant-design:key-outlined',
      onClick: (_e: any, record: any) => handleResetPwd(record),
    },
    {
      label: $t('tenant.member.action.delete'),
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

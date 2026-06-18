<script setup lang="ts">
import type { ElTable as ElTableType } from 'element-plus';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus';

import { TenantService } from '#/api/tenant/account';
import { SubscriptionService } from '#/api/tenant/subscription';
import { $t } from '#/locales';

interface Tenant {
  id: string;
  name: string;
  code: string;
  status: string;
}

const tableRef = ref<InstanceType<typeof ElTableType>>();
const tenantList = ref<Tenant[]>([]);
const selectedIds = ref<string[]>([]);
const currentRow = ref<any>(null);
const onSuccessRef = ref<(() => void) | null>(null);

/**
 * 请求计数器，防止快速开关抽屉时旧响应覆盖新数据
 */
let loadId = 0;

const syncTableSelection = async () => {
  await nextTick();
  if (!tableRef.value) return;
  tableRef.value.clearSelection();
  // 快照当前选中 ID，避免 toggleRowSelection 触发 selection-change 污染循环中的判断
  const ids = new Set(selectedIds.value);
  tenantList.value.forEach((row) => {
    tableRef.value?.toggleRowSelection(row, ids.has(row.id));
  });
};

const loadData = async (planId: string) => {
  const id = ++loadId;
  try {
    // 不用 format=select（只返回 label/value），用 normal 格式获取完整 Tenant 对象
    const [tenantRes, subRes] = await Promise.all([
      TenantService.list({ limit: 9999 }),
      SubscriptionService.get(planId),
    ]);
    if (id !== loadId) return; // 已失效，忽略
    // 响应拦截器已剥掉外层 data，formatNormal 返回 { items, total }
    // 统一转为字符串，避免 snowflake ID 精度丢失
    tenantList.value = (tenantRes?.items || tenantRes || []).map((t: any) => ({
      ...t,
      id: String(t.id),
    }));
    selectedIds.value = [...(subRes?.tenant_ids || [])].map(String);
    await syncTableSelection();
  } catch {
    if (id !== loadId) return;
    tenantList.value = [];
    selectedIds.value = [];
  }
};

const onSelectionChange = (rows: Tenant[]) => {
  selectedIds.value = rows.map((r) => String(r.id));
};

const getCheckedIds = (): string[] => {
  // snowflake ID 可能超过 JS 安全整数范围，全部转为字符串
  return selectedIds.value.map(String);
};

const [Drawer, drawerApi] = useVbenDrawer({
  title: $t('tenant.subscription.drawer.grant_tenant.title'),
  class: 'w-[800px]',
  closeOnClickModal: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ onSuccess?: () => void; row: any }>();
      currentRow.value = data?.row;
      onSuccessRef.value = data?.onSuccess || null;
      // 重置状态，避免显示上一个套餐的旧数据
      tenantList.value = [];
      selectedIds.value = [];
      if (currentRow.value?.id) loadData(currentRow.value.id);
    }
  },
  async onConfirm() {
    const ids = getCheckedIds();
    drawerApi.setState({ confirmLoading: true });
    try {
      const res = await SubscriptionService.bindTenant(
        currentRow.value.id,
        ids,
      );
      ElMessage.success($t('tenant.subscription.drawer.grant_tenant.success'));
      // 用后端返回的 ids 回显选中的租户
      if (res?.ids) {
        selectedIds.value = res.ids;
        await syncTableSelection();
      }
      onSuccessRef.value?.();
      drawerApi.close();
    } catch (error: any) {
      ElMessage.error(
        error?.message || $t('tenant.subscription.drawer.grant_tenant.failed'),
      );
    } finally {
      drawerApi.setState({ confirmLoading: false });
    }
  },
  onCancel() {
    drawerApi.close();
  },
});
</script>

<template>
  <Drawer>
    <template #extra>
      <span class="text-sm text-gray-400">{{ $t('tenant.subscription.drawer.grant_tenant.extra_plan')
        }}{{ currentRow?.name }}</span>
      <span class="text-sm text-gray-400 ml-3">{{ $t('tenant.subscription.drawer.grant_tenant.extra_tenant')
        }}{{ selectedIds.length
        }}{{
          $t('tenant.subscription.drawer.grant_tenant.extra_tenant_unit')
        }}</span>
    </template>
    <div class="tenant-selector">
      <ElTable
        ref="tableRef"
        :data="tenantList"
        row-key="id"
        height="calc(100vh - 220px)"
        @selection-change="onSelectionChange"
      >
        <ElTableColumn type="selection" width="50" />
        <ElTableColumn
          prop="name"
          :label="$t('tenant.subscription.drawer.grant_tenant.columns.name')"
          min-width="200"
        />
        <ElTableColumn
          prop="code"
          :label="$t('tenant.subscription.drawer.grant_tenant.columns.code')"
          width="150"
        />
        <ElTableColumn
          prop="status"
          :label="$t('tenant.subscription.drawer.grant_tenant.columns.status')"
          width="80"
        >
          <template #default="{ row }">
            <ElTag
              :type="row.status === 'active' ? 'success' : 'info'"
              size="small"
            >
              {{
                row.status === 'active'
                  ? $t('tenant.subscription.drawer.grant_tenant.status_active')
                  : $t(
                      'tenant.subscription.drawer.grant_tenant.status_disabled',
                    )
              }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </Drawer>
</template>

<style scoped>
.tenant-selector {
  padding: 4px 0;
}
</style>

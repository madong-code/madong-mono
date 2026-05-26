<template>
  <Drawer>
    <template #extra>
      <span class="text-sm text-gray-400">套餐：{{ currentRow?.name }}</span>
      <span class="text-sm text-gray-400 ml-3">已关联：{{ selectedIds.length }} 个租户</span>
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
        <ElTableColumn prop="name" label="租户名称" min-width="200" />
        <ElTableColumn prop="code" label="编码" width="150" />
        <ElTableColumn prop="status" label="状态" width="80">
          <template #default="{ row }">
            <ElTag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus';
import type { ElTable as ElTableType } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';

import { SubscriptionService } from '#/api/platform/tenant-subscription';
import { TenantService } from '#/api/platform/tenant';

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
  const ids = [...selectedIds.value];
  tenantList.value.forEach((row) => {
    tableRef.value!.toggleRowSelection(row, ids.includes(row.id));
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
  title: '关联租户',
  class: 'w-[800px]',
  closeOnClickModal: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ row: any; onSuccess?: () => void }>();
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
      const res = await SubscriptionService.bindTenant(currentRow.value.id, ids);
      ElMessage.success('关联租户成功');
      // 用后端返回的 ids 回显选中的租户
      if (res?.ids) {
        selectedIds.value = res.ids;
        await syncTableSelection();
      }
      onSuccessRef.value?.();
      drawerApi.close();
    } catch (e: any) {
      ElMessage.error(e?.message || '操作失败');
    } finally {
      drawerApi.setState({ confirmLoading: false });
    }
  },
  onCancel() {
    drawerApi.close();
  },
});
</script>

<style scoped>
.tenant-selector {
  padding: 4px 0;
}
</style>

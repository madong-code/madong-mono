<template>
  <Drawer>
    <template #extra>
      <span class="text-sm text-gray-400">租户：{{ currentRow?.name }}</span>
    </template>
    <div class="plan-selector">
      <ElTable
        ref="tableRef"
        :data="planList"
        row-key="id"
        height="calc(100vh - 220px)"
        @selection-change="onSelectionChange"
      >
        <ElTableColumn type="selection" width="50" />
        <ElTableColumn prop="name" label="套餐名称" min-width="200" />
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

import { SubscriptionService } from '#/api/tenant/subscription';
import { TenantService } from '#/api/tenant/account';

interface Plan {
  id: number | string;
  name: string;
  code: string;
  status: string;
}

const tableRef = ref<InstanceType<typeof ElTableType>>();
const planList = ref<Plan[]>([]);
const selectedIds = ref<(number | string)[]>([]);
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
  planList.value.forEach((row) => {
    tableRef.value!.toggleRowSelection(row, ids.includes(row.id));
  });
};

const loadData = async (tenantId: string) => {
  const id = ++loadId;
  try {
    // 不用 format=select（只返回 label/value），用 normal 格式获取完整 Plan 对象
    const [planRes, tenantRes] = await Promise.all([
      SubscriptionService.list({ limit: 9999 }),
      TenantService.get(tenantId),
    ]);
    if (id !== loadId) return; // 已失效，忽略
    // 响应拦截器已剥掉外层 data，formatNormal 返回 { items, total }
    planList.value = planRes?.items || planRes || [];
    selectedIds.value = [...(tenantRes?.plan_ids || [])];
    await syncTableSelection();
  } catch {
    if (id !== loadId) return;
    planList.value = [];
    selectedIds.value = [];
  }
};

const onSelectionChange = (rows: Plan[]) => {
  selectedIds.value = rows.map((r) => r.id);
};

const getCheckedIds = (): number[] => {
  return selectedIds.value
    .map((id) => (typeof id === 'number' ? id : parseInt(String(id), 10)))
    .filter((id) => !isNaN(id) && id > 0);
};

const [Drawer, drawerApi] = useVbenDrawer({
  title: '授权套餐',
  class: 'w-[800px]',
  closeOnClickModal: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ row: any; onSuccess?: () => void }>();
      currentRow.value = data?.row;
      onSuccessRef.value = data?.onSuccess || null;
      // 重置状态，避免显示上一个租户的旧数据
      planList.value = [];
      selectedIds.value = [];
      if (currentRow.value?.id) loadData(currentRow.value.id);
    }
  },
  async onConfirm() {
    const ids = getCheckedIds();
    drawerApi.setState({ confirmLoading: true });
    try {
      const res = await TenantService.bindPlan(currentRow.value.id, ids);
      ElMessage.success('授权套餐成功');
      // 用后端返回的 plan_ids 回显选中的套餐
      if (res?.plan_ids) {
        selectedIds.value = res.plan_ids;
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
.plan-selector {
  padding: 4px 0;
}
</style>

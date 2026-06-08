<script setup lang="ts">
import type { UserSession } from '#/api/auth/profile/types';

import { computed, onMounted, ref } from 'vue';

import {
  ElButton,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { ProfileService } from '#/api/auth/profile';
import { formatDate } from '#/utils';

const loading = ref(false);
const deviceList = ref<UserSession[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 表格最大高度（撑满视口）
const tableHeight = computed(() => 'calc(60vh - 180px)');

async function loadDevices() {
  loading.value = true;
  try {
    const resp = (await ProfileService.getOnlineDevices({
      page: currentPage.value,
      page_size: pageSize.value,
    })) as any;

    // 解析响应：支持 { data: { list, total } } 或直接 { list, total } 或数组
    const dataBody = resp?.data ?? resp;
    const list =
      dataBody?.list ??
      dataBody?.lists ??
      dataBody?.rows ??
      (Array.isArray(dataBody) ? dataBody : []);
    deviceList.value = Array.isArray(list) ? list : [];
    total.value = dataBody?.total ?? deviceList.value.length;
  } catch {
    ElMessage.error('获取在线设备列表失败');
  } finally {
    loading.value = false;
  }
}

async function handleKickout(row: UserSession) {
  try {
    await ElMessageBox.confirm(
      `确定要将设备「${row.browser || '未知设备'}」强制下线吗？`,
      '强制下线',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
    );

    await ProfileService.kickoutSession((row as any).jti || row.id);
    ElMessage.success('强制下线成功');
    await loadDevices();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadDevices();
}

function handleSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  loadDevices();
}

onMounted(() => {
  loadDevices();
});
</script>

<template>
  <div class="online-device w-full">
    <div class="device-card">
      <div class="card-header">
        <div class="header-left">
          <h3>当前在线设备</h3>
          <span class="device-count">共 {{ total }} 台设备</span>
        </div>
        <ElButton size="small" @click="loadDevices">刷新</ElButton>
      </div>

      <!-- 空状态 -->
      <ElEmpty
        v-if="!loading && deviceList.length === 0"
        description="暂无在线设备"
        :image-size="120"
      />

      <!-- 表格 -->
      <ElTable
        v-else
        :data="deviceList"
        v-loading="loading"
        stripe
        :max-height="tableHeight"
        class="device-table"
        empty-text="暂无在线设备"
      >
        <ElTableColumn label="用户名" prop="user_name" min-width="120" />
        <ElTableColumn label="IP 地址" prop="ip" min-width="130" />
        <ElTableColumn label="IP 归属地" prop="ip_location" min-width="120" />
        <ElTableColumn label="浏览器" prop="browser" min-width="140">
          <template #default="{ row }">
            <span>{{ row.browser || '-' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作系统" prop="os" min-width="120">
          <template #default="{ row }">
            <span>{{ row.os || '-' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="登录时间" prop="login_time" min-width="170">
          <template #default="{ row }">
            <span>{{ formatDate(row.login_time) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <ElTag
              :type="row.status === 1 ? 'success' : 'warning'"
              size="small"
            >
              {{ row.status === 1 ? '在线' : '离线' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              type="danger"
              size="small"
              link
              @click="handleKickout(row)"
            >
              强制下线
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div class="pagination-wrap" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.online-device {
  width: 100%;
}

.device-card {
  min-height: 300px;
  padding: 24px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.device-count {
  font-size: 13px;
  color: #999;
}

.device-table {
  width: 100%;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .device-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .device-table :deep(.el-table__body) {
    width: 100% !important;
  }
}
</style>

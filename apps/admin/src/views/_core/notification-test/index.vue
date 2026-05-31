<script lang="ts" setup>
import { ref } from 'vue';

import { ElMessage } from 'element-plus';
import { Bell } from 'lucide-vue-next';

import { NotificationApi } from '#/api/notification';

const loading = ref(false);
const testResult = ref<any>(null);

// 测试获取未读数
async function testUnreadCount() {
  loading.value = true;
  try {
    const data = await NotificationApi.getUnreadCount();
    testResult.value = data;
    ElMessage.success('获取未读数成功');
  } catch (error: any) {
    ElMessage.error(`获取未读数失败: ${error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}

// 测试获取消息列表
async function testGetList() {
  loading.value = true;
  try {
    const data = await NotificationApi.getList({ page: 1, page_size: 10 });
    testResult.value = data;
    ElMessage.success('获取消息列表成功');
  } catch (error: any) {
    ElMessage.error(`获取消息列表失败: ${error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}

// 测试标记全部已读
async function testMarkAllRead() {
  loading.value = true;
  try {
    await NotificationApi.markAllRead();
    ElMessage.success('标记全部已读成功');
    testUnreadCount(); // 刷新未读数
  } catch (error: any) {
    ElMessage.error(`标记全部已读失败: ${error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">通知系统测试页面</h1>
      <p class="mt-2 text-muted-foreground">用于测试通知系统的各项功能</p>
    </div>

    <div class="mb-6 flex gap-4">
      <button
        class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        :disabled="loading"
        @click="testUnreadCount"
      >
        <Bell class="size-4" />
        测试未读数
      </button>

      <button
        class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
        :disabled="loading"
        @click="testGetList"
      >
        测试消息列表
      </button>

      <button
        class="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
        :disabled="loading"
        @click="testMarkAllRead"
      >
        标记全部已读
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="text-muted-foreground">加载中...</div>
    </div>

    <div v-else-if="testResult" class="rounded-lg border border-border p-4">
      <h2 class="mb-4 text-lg font-semibold">测试结果</h2>
      <pre class="overflow-auto rounded-md bg-muted p-4 text-sm">{{
        JSON.stringify(testResult, null, 2)
      }}</pre>
    </div>

    <div v-else class="py-8 text-center text-muted-foreground">
      点击上方按钮进行测试
    </div>
  </div>
</template>

<style scoped></style>

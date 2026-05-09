<template>
  <div class="demo-page">
    <h2>🔍 数据详情页面</h2>
    <p>这是一个嵌套子路由的详情页面</p>
    <div class="info">
      <span class="label">路由格式:</span>
      <span class="value">RouteRecordStringComponent</span>
    </div>
    <div class="info">
      <span class="label">模块名称:</span>
      <span class="value">demo</span>
    </div>
    <div class="info">
      <span class="label">路由名称:</span>
      <span class="value">DemoDataDetail</span>
    </div>
    <div class="info">
      <span class="label">当前ID:</span>
      <span class="value">{{ id }}</span>
    </div>
    <button @click="goBack">返回列表</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id);

const goBack = () => {
  router.push('/demo/data-list');
};
</script>

<style scoped>
.demo-page {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

h2 {
  color: #ec4899;
  margin-bottom: 20px;
}

.info {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.label {
  font-weight: bold;
  color: #64748b;
}

.value {
  color: #3b82f6;
}

button {
  margin-top: 20px;
  padding: 10px 25px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<template>
  <div class="demo-page">
    <h2>📋 数据列表页面</h2>
    <p>这是一个使用 RouteRecordStringComponent 格式定义的列表页面</p>
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
      <span class="value">DemoDataList</span>
    </div>
    <div class="data-list">
      <h3>示例数据</h3>
      <ul>
        <li v-for="item in mockData" :key="item.id">
          <span>{{ item.name }}</span>
          <button @click="goDetail(item.id)">查看详情</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const mockData = ref([
  { id: 1, name: '数据项 1' },
  { id: 2, name: '数据项 2' },
  { id: 3, name: '数据项 3' },
]);

const goDetail = (id: number) => {
  router.push(`/demo/data-list/detail/${id}`);
};
</script>

<style scoped>
.demo-page {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

h2 {
  color: #8b5cf6;
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

.data-list {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.data-list h3 {
  margin-bottom: 15px;
  color: #475569;
}

.data-list ul {
  list-style: none;
  padding: 0;
}

.data-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.data-list button {
  padding: 5px 15px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<template>
  <div class="demo-page">
    <h2>🧩 后端路由测试页面</h2>
    <p>这是一个使用 RouteRecordStringComponent 格式定义的后端路由</p>
    <div class="info">
      <span class="label">路由格式:</span>
      <span class="value">RouteRecordStringComponent</span>
    </div>
    <div class="info">
      <span class="label">组件类型:</span>
      <span class="value">String</span>
    </div>
    <div class="info">
      <span class="label">模块名称:</span>
      <span class="value">demo</span>
    </div>
    <div class="info">
      <span class="label">路由名称:</span>
      <span class="value">DemoBackendTest</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 后端路由测试组件
</script>

<style scoped>
.demo-page {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

h2 {
  color: #10b981;
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
</style>

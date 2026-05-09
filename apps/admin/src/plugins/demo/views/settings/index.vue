<template>
  <div class="demo-page">
    <h2>⚙️ 插件设置页面</h2>
    <p>这是一个使用 RouteRecordRaw 格式定义的插件设置页面</p>
    <div class="info">
      <span class="label">路由格式:</span>
      <span class="value">RouteRecordRaw</span>
    </div>
    <div class="info">
      <span class="label">路由名称:</span>
      <span class="value">DemoSettings</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 插件设置组件
</script>

<style scoped>
.demo-page {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

h2 {
  color: #f59e0b;
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
  color: #10b981;
}
</style>

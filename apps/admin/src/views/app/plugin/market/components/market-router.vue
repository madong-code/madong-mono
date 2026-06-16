<script setup lang="ts">
/** 模块市场路由：检测站点模式，分发 SaaS 或 单体 市场页面 */
import { computed, onMounted, ref } from 'vue';

import { requestClient } from '#/api/request';

import GrantedModuleMarket from './granted/granted-module-market.vue';
import StandaloneModuleMarket from './standalone/standalone-module-market.vue';

defineOptions({ name: 'MarketRouter' });

const mode = ref<string>('standalone');
const loading = ref(true);

onMounted(async () => {
  try {
    const res: any = await requestClient.get('/site/mode');
    mode.value = res?.mode || 'standalone';
  } catch {
    mode.value = 'standalone';
  } finally {
    loading.value = false;
  }
});

const isSaasMode = computed(() => mode.value === 'saas');
</script>

<template>
  <div v-loading="loading" class="h-full flex flex-col">
    <GrantedModuleMarket v-if="isSaasMode" class="flex-1" />
    <StandaloneModuleMarket v-else-if="!loading" class="flex-1" />
  </div>
</template>

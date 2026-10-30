<script lang="ts" setup>
import { watch } from 'vue';

import { useElementPlusDesignTokens } from '@vben/hooks';

import { ElConfigProvider } from 'element-plus';

import { elementLocale } from '#/locales';
import { useSiteConfigStore } from '#/store/modules/site-config';
import { buildStaticUrl } from '#/utils/url';

defineOptions({ name: 'App' });

useElementPlusDesignTokens();

const siteConfigStore = useSiteConfigStore();

// 监听站点配置变化，动态更新 title 和 favicon
watch(
  () => siteConfigStore.getBrandConfig(),
  (config) => {
    if (config.title) {
      document.title = config.title;
    }
    if (config.favicon) {
      const faviconUrl = buildStaticUrl(config.favicon);
      // 与 syncTenantPreferences 共用同一取数逻辑与去重设置，避免两端取到不同配置反复切换
      if (faviconUrl) {
        const link = document.querySelector<HTMLLinkElement>(
          'link[rel="icon"]',
        );
        if (link && link.href !== faviconUrl) {
          link.href = faviconUrl;
        }
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>

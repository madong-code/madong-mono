<script lang="ts" setup>
import { computed, onMounted } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';
import { useSiteConfigStore } from '#/store/modules/site-config';

const siteConfigStore = useSiteConfigStore();

const appName = computed(
  () => siteConfigStore.platformConfig.title || preferences.app.name,
);
const logo = computed(
  () => siteConfigStore.platformConfig.logo || preferences.logo.source,
);
const logoDark = computed(
  () => siteConfigStore.platformConfig.logo || preferences.logo.sourceDark,
);

// 登录页加载时，如果平台配置为空则自动获取（保障退出登录后有平台品牌信息可展示）
onMounted(() => {
  if (!siteConfigStore.platformIsLoaded) {
    siteConfigStore.fetchPlatformConfig();
  }
});
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :logo-dark="logoDark"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus';

import { defineAsyncComponent, markRaw, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElCard, ElTabPane, ElTabs } from 'element-plus';

import { $t } from '#/locales';

const activeName = ref('1');

const handleClick = (tab: TabsPaneContext) => {
  const targetKey = tab.props.name;
  settingList.value.forEach((item) => {
    if (item.key === targetKey) {
      item.loadKey += 1;
    }
  });
};

const settingList = ref([
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/site.vue')),
    ),
    key: '1',
    name: $t('system.config.site.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/web-site.vue')),
    ),
    key: '6',
    name: $t('system.config.web_site.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/baidu-tongji.vue')),
    ),
    key: '7',
    name: $t('system.config.baidu_tongji.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/upload.vue')),
    ),
    key: '2',
    name: $t('system.config.upload.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/email.vue')),
    ),
    key: '3',
    name: $t('system.config.email.title'),
    loadKey: 0,
  },
  {
    component: markRaw(defineAsyncComponent(() => import('./modules/sms.vue'))),
    key: '4',
    name: $t('system.config.sms.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/common.vue')),
    ),
    key: '5',
    name: $t('system.config.common.title'),
    loadKey: 0,
  },
]);
</script>

<template>
  <Page auto-content-height class="p-2">
    <ElCard>
      <ElTabs v-model="activeName" @tab-click="handleClick">
        <ElTabPane
          v-for="item in settingList"
          :key="item.key"
          :name="item.key"
          :label="item.name"
        >
          <component :is="item.component" :key="item.loadKey" v-bind="$attrs" />
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </Page>
</template>

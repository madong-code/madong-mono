<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus';

import { defineAsyncComponent, markRaw, ref } from 'vue';

import { ElCard, ElTabPane, ElTabs } from 'element-plus';

import { Page } from '#/components/page';
import { $t } from '#/locales';

const activeName = ref('1');

const handleClick = (tab: TabsPaneContext) => {
  const targetKey = tab.props.name as string;
  settingList.value.forEach((item) => {
    if (item.key === targetKey) {
      item.loadKey += 1;
    }
  });
};

const settingList = ref([
  {
    component: markRaw(
      defineAsyncComponent(() => import('./components/site.vue')),
    ),
    key: '1',
    name: $t('system.config.site.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./components/upload.vue')),
    ),
    key: '2',
    name: $t('system.config.upload.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./components/email.vue')),
    ),
    key: '3',
    name: $t('system.config.email.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./components/sms.vue')),
    ),
    key: '4',
    name: $t('system.config.sms.title'),
    loadKey: 0,
  },
]);
</script>

<template>
  <Page>
    <ElCard>
      <ElTabs v-model="activeName" @tab-click="handleClick">
        <ElTabPane
          v-for="item in settingList"
          :key="item.key"
          :name="item.key"
          :label="item.name"
          class="mt-5"
        >
          <component :is="item.component" :key="item.loadKey" v-bind="$attrs" />
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </Page>
</template>

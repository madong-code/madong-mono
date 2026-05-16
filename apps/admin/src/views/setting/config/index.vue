<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in settingList" :key="item.key" :name="item.key" :label="item.name">
        <component :is="item.component" :key="item.loadKey" v-bind="$attrs" />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<script setup lang="tsx">
import { ref, defineAsyncComponent, markRaw } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { $t } from '#/locales'
import { Page } from '#/components/page'

const activeName = ref('1')

const handleClick = (tab: TabsPaneContext) => {
  const targetKey = tab.props.name
  settingList.value.forEach((item) => {
    if (item.key === targetKey) {
      item.loadKey += 1
    }
  })
}

const settingList = ref([
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/site.vue')),
    ),
    key: '1',
    name: $t('setting.config.site.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/web-site.vue')),
    ),
    key: '6',
    name: $t('setting.config.web_site.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/baidu-tongji.vue')),
    ),
    key: '7',
    name: $t('setting.config.baidu_tongji.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/upload.vue')),
    ),
    key: '2',
    name: $t('setting.config.upload.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/email.vue')),
    ),
    key: '3',
    name: $t('setting.config.email.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/sms.vue')),
    ),
    key: '4',
    name: $t('setting.config.sms.title'),
    loadKey: 0,
  },
  {
    component: markRaw(
      defineAsyncComponent(() => import('./modules/common.vue')),
    ),
    key: '5',
    name: $t('setting.config.common.title'),
    loadKey: 0,
  },
])
</script>

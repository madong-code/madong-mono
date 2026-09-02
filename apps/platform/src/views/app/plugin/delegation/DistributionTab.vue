<script setup lang="ts">
/** 平台端"插件分发中心"Tab (WP9)
 *  - 子 Tab: 矩阵 + 升级统计
 */
import { ref } from 'vue';

import { ElTabPane, ElTabs } from 'element-plus';

import { $t } from '#/locales';

import MatrixTab from './components/MatrixTab.vue';
import UpgradeAggregateBar from './components/UpgradeAggregateBar.vue';

defineOptions({ name: 'DistributionTab' });

const activeSub = ref<'matrix' | 'upgrade'>('upgrade');
</script>

<template>
  <div class="distribution-tab">
    <ElTabs v-model="activeSub">
      <ElTabPane :label="$t('app.plugin.distribution.sub.upgrade')" name="upgrade">
        <UpgradeAggregateBar />
      </ElTabPane>
      <ElTabPane :label="$t('app.plugin.distribution.sub.matrix')" name="matrix">
        <MatrixTab />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

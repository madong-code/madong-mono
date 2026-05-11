<script lang="ts" setup>
import { Page, VResize } from '@vben/common-ui';

import { ref } from 'vue';

const sizeList = ref([
  { width: 300, height: 200, top: 0, left: 0 },
  { width: 200, height: 200, top: 0, left: 320 },
  { width: 200, height: 150, top: 220, left: 0 },
  { width: 300, height: 150, top: 220, left: 220 },
]);

const colorMap = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200'];
</script>

<template>
  <Page description="拖动调整大小组件示例" title="拖动调整">
    <div class="relative h-[400px] w-full">
      <VResize
        v-for="(item, index) in sizeList"
        :key="index"
        v-model:width="item.width"
        v-model:height="item.height"
        v-model:top="item.top"
        v-model:left="item.left"
        :class="colorMap[index]"
        class="absolute flex items-center justify-center border border-gray-300"
      >
        <div class="text-center">
          <div>{{ item.width }} x {{ item.height }}</div>
          <div class="text-xs text-gray-500">top: {{ item.top }}, left: {{ item.left }}</div>
        </div>
      </VResize>
    </div>
  </Page>
</template>

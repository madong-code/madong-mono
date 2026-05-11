<script lang="ts" setup>
import { MotionGroup } from '@vben/plugins/motion';

import { ElCard } from 'element-plus';
</script>

<template>
  <Page description="动画组件示例" title="Motion">
    <ElCard class="mb-4">
      <template #header>使用指令</template>
      <div class="flex flex-wrap gap-4">
        <div v-motion-fade-visible class="h-[100px] w-[100px] bg-blue-200 flex items-center justify-center">fade</div>
        <div v-motion-slide-visible-left class="h-[100px] w-[100px] bg-green-200 flex items-center justify-center">slide</div>
        <div v-motion-slide-visible-bottom class="h-[100px] w-[100px] bg-yellow-200 flex items-center justify-center">slide-b</div>
      </div>
    </ElCard>

    <ElCard>
      <template #header>分组动画</template>
      <MotionGroup :delay="100" preset="slideVisibleLeft">
        <div v-for="i in 5" :key="i" class="mb-2 h-[50px] w-[200px] bg-pink-200 flex items-center justify-center">
          Item {{ i }}
        </div>
      </MotionGroup>
    </ElCard>
  </Page>
</template>

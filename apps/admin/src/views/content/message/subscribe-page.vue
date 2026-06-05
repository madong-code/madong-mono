<script lang="ts" setup>
import { computed, onMounted } from 'vue';

import { useNotifyStore } from '#/store/modules/notify';

const notifyStore = useNotifyStore();

onMounted(() => {
  notifyStore.loadSubscriptions();
});

const subscribeTypes = computed(() => notifyStore.subscribeList);

function toggleCategory(catKey: string) {
  notifyStore.toggleSubscription(catKey);
}

function toggleModule(catKey: string, modKey: string) {
  notifyStore.toggleSubscription(catKey, modKey);
}
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <h2 class="mb-6 text-xl font-semibold">消息订阅设置</h2>

      <div
        v-if="notifyStore.subscribeLoading"
        class="flex items-center justify-center py-12"
      >
        <div class="text-muted-foreground">加载中...</div>
      </div>

      <div
        v-else-if="subscribeTypes.length === 0"
        class="flex items-center justify-center py-12"
      >
        <div class="text-muted-foreground">暂无消息类型</div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="cat in subscribeTypes"
          :key="cat.key"
          class="rounded-lg border border-border p-4"
        >
          <!-- 分类标题 -->
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-medium text-base">{{ cat.name }}</span>
              <span
                v-if="cat.description"
                class="text-xs text-muted-foreground"
              >
                ({{ cat.description }})
              </span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                class="peer sr-only"
                :checked="cat.category_subscribed"
                @change="toggleCategory(cat.key)"
              />
              <div
                class="h-6 w-11 rounded-full bg-muted-foreground/30 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full"
              ></div>
              <span class="ml-2 text-sm">
                {{ cat.category_subscribed ? '已订阅' : '未订阅' }}
              </span>
            </label>
          </div>

          <!-- 模块列表 -->
          <div
            v-if="cat.modules && cat.modules.length > 0"
            class="ml-4 space-y-3"
          >
            <div
              v-for="mod in cat.modules"
              :key="mod.key"
              class="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2.5"
            >
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-medium">{{ mod.name }}</span>
                <span
                  v-if="mod.description"
                  class="text-xs text-muted-foreground"
                >
                  {#{{ mod.key }}#}{{ mod.description || '' }}
                </span>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  class="peer sr-only"
                  :checked="cat.modules_subscribed[mod.key] ?? true"
                  :disabled="!cat.category_subscribed"
                  @change="toggleModule(cat.key, mod.key)"
                />
                <div
                  class="h-6 w-11 rounded-full bg-muted-foreground/30 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full"
                  :class="{ 'opacity-50': !cat.category_subscribed }"
                ></div>
                <span class="ml-2 text-sm">
                  {{ cat.modules_subscribed[mod.key] ? '已订阅' : '未订阅' }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped></style>

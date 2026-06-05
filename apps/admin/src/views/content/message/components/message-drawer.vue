<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useNotifyStore } from '#/store/modules/notify';
import MessageCenter from '#/views/content/message/index.vue';

const notifyStore = useNotifyStore();
const drawerActiveTab = ref<'all' | 'unread'>('unread');

const [Drawer, drawerApi] = useVbenDrawer({
  placement: 'right',
  closable: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
});

function open() {
  drawerActiveTab.value = 'unread';
  drawerApi.open();
}

function close() {
  drawerApi.close();
}

defineExpose({ open, close });
</script>

<template>
  <Drawer :footer="false" class="w-[80%]">
    <template #title>
      <div class="flex items-center gap-2 text-sm">
        <button
          class="font-medium transition-colors"
          :class="
            drawerActiveTab === 'unread'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="drawerActiveTab = 'unread'"
        >
          未读
          <span
            v-if="notifyStore.unreadCount.total > 0"
            class="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] text-white"
          >
            {{
              notifyStore.unreadCount.total > 99
                ? '99+'
                : notifyStore.unreadCount.total
            }}
          </span>
        </button>
        <span class="text-muted-foreground/20">|</span>
        <button
          class="font-medium transition-colors"
          :class="
            drawerActiveTab === 'all'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="drawerActiveTab = 'all'"
        >
          全部
        </button>
      </div>
    </template>
    <MessageCenter
      :active-tab="drawerActiveTab"
      @update:active-tab="drawerActiveTab = $event"
    />
  </Drawer>
</template>

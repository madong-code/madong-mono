<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';

import { WangEditor } from '@vben/plugins/wangeditor';

import { ElButton } from 'element-plus';

import { Icon } from '#/components/icon';

const props = withDefaults(
  defineProps<{
    editable?: boolean;
    excludeKeys?: string[];
    height?: string;
    insertKeys?: { index: number; keys: string[] };
    mode?: 'default' | 'simple';
    modelValue?: string;
    placeholder?: string;
    previewable?: boolean;
    toolbar?: boolean;
    toolbarKeys?: string[];
    uploadConfig?: Record<string, any>;
  }>(),
  {
    modelValue: '',
    height: '500px',
    mode: 'default',
    placeholder: '',
    toolbarKeys: undefined,
    insertKeys: undefined,
    excludeKeys: undefined,
    uploadConfig: undefined,
    editable: true,
    toolbar: true,
    previewable: true,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

// 合并上传配置：VITE_API_URL 由包装器统一处理，schema 只传路径
const mergedUploadConfig = computed(() => {
  const custom = props.uploadConfig || {};
  let server = custom.server || '/adminapi/system/files/common/wangeditor';
  // 相对路径统一拼接 VITE_API_URL，绝对 URL 直接用
  if (!/^https?:\/\//i.test(server)) {
    server = import.meta.env.VITE_API_URL + server;
  }
  return { ...custom, server };
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: string) {
    emit('update:modelValue', val);
  },
});

const slots = useSlots();

const fullscreen = ref(false);

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value;
}

defineExpose({
  getValue() {
    return value.value;
  },
});
</script>

<template>
  <div
    class="wangeditor-wrapper"
    :class="[{ 'wangeditor-fullscreen': fullscreen }]"
  >
    <WangEditor
      v-model="value"
      :height="height"
      :mode="mode"
      :placeholder="placeholder"
      :toolbar-keys="toolbarKeys"
      :insert-keys="insertKeys"
      :exclude-keys="excludeKeys"
      :upload-config="mergedUploadConfig"
      :editable="editable"
      :toolbar="toolbar"
      :previewable="previewable"
      v-bind="$attrs"
    >
      <template v-for="(_, slotName) in slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </WangEditor>

    <!-- 全屏按钮 -->
    <div class="wangeditor-fullscreen-btn">
      <ElButton
        :aria-label="fullscreen ? '退出全屏' : '全屏'"
        text
        size="small"
        @click="toggleFullscreen"
      >
        <Icon
          :icon="
            fullscreen
              ? 'fluent:full-screen-minimize-24-regular'
              : 'fluent:full-screen-maximize-24-regular'
          "
        />
      </ElButton>
    </div>
  </div>
</template>

<style scoped>
.wangeditor-wrapper {
  position: relative;
  overflow: hidden;
}

.wangeditor-fullscreen-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.wangeditor-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: hsl(var(--card));
}

.wangeditor-fullscreen :deep(.editor-wrapper) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.wangeditor-fullscreen :deep(.w-e-text-container) {
  flex: 1;
  overflow-y: auto;
}
</style>

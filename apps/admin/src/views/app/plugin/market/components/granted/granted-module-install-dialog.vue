<script setup lang="ts">
/** 租户插件安装/更新弹窗 */
import { computed, onUnmounted, ref } from 'vue';

import { ElButton, ElCard, ElIcon, ElMessage, ElProgress } from 'element-plus';
import { Download } from 'lucide-vue-next';

import { sse } from '#/api/request';
import { useDialog } from '#/components/dialog';
import { $t } from '#/locales';

defineOptions({ name: 'GrantedModuleInstallDialog' });

const props = defineProps<{ plugin: any }>();

const emit = defineEmits<{ close: []; refresh: [] }>();

const [Dialog, dialogApi] = useDialog({
  title: $t('app.plugin.market.install.title'),
  width: '500px',
  fullscreen: false,
  footer: false,
  draggable: true,
  closeOnClickModal: false,
  destroyOnClose: true,
});

const loading = ref(false);
const installing = ref(false);
const progress = ref(0);
const progressMessage = ref('');
let sseConn: null | { close: () => void } = null;

const isUpdate = computed(() =>
  Boolean(props.plugin?.is_installed && props.plugin?.has_update),
);

const pluginKey = computed(() => props.plugin?.name || props.plugin?.code);

const openDialog = () => {
  if (!pluginKey.value) {
    ElMessage.error($t('app.plugin.market.install.invalid'));
    return;
  }
  loading.value = false;
  installing.value = false;
  progress.value = 0;
  progressMessage.value = '';
  dialogApi.setState({
    title: isUpdate.value
      ? $t('app.plugin.market.update_db')
      : $t('app.plugin.market.install.title'),
  });
  dialogApi.open();
};

const finishWithError = (payload?: any) => {
  const eventData = payload?.data || payload;
  const fallback = isUpdate.value
    ? $t('app.plugin.market.update.fail')
    : $t('app.plugin.market.install.fail');
  ElMessage.error(eventData?.message || fallback);
  loading.value = false;
  installing.value = false;
  sseConn?.close();
  sseConn = null;
};

const confirmInstall = () => {
  installing.value = true;
  loading.value = true;
  progress.value = 0;
  progressMessage.value = isUpdate.value ? '开始更新...' : '开始安装...';
  const action = isUpdate.value ? 'update' : 'install';

  sseConn = sse(`/tenant/plugin/${pluginKey.value}/${action}`, {
    progress: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData?.progress !== undefined)
        progress.value = eventData.progress;
      if (eventData?.message) progressMessage.value = eventData.message;
    },
    completed: (payload: any) => {
      const eventData = payload?.data || payload;
      progress.value = 100;
      progressMessage.value = eventData?.message || '';
      ElMessage.success(
        isUpdate.value
          ? $t('app.plugin.market.update.success', { name: props.plugin.name })
          : $t('app.plugin.market.install.success', {
              name: props.plugin.name,
            }),
      );
      sseConn?.close();
      sseConn = null;
      loading.value = false;
      installing.value = false;
      emit('refresh');
      handleClose();
    },
    error: finishWithError,
    onError: () => {
      if (installing.value) finishWithError();
    },
  });
};

const handleClose = () => {
  sseConn?.close();
  sseConn = null;
  dialogApi.close();
  emit('close');
};

onUnmounted(() => sseConn?.close());

defineExpose({ openDialog });
</script>

<template>
  <Dialog>
    <ElCard class="box-card !border-none" shadow="never">
      <div class="p-4 text-center">
        <ElIcon class="mb-4" :size="48" color="#409eff"><Download /></ElIcon>
        <h3 class="text-lg font-medium mb-2">
          {{ $t('app.plugin.market.install.dialog_title') }}
        </h3>
        <p
          class="text-sm text-gray-500 mb-6"
          v-html="
            $t('app.plugin.market.install.confirm_msg', { name: plugin?.name })
          "
        ></p>
        <div v-if="loading" class="flex flex-col items-center gap-3">
          <ElProgress
            :percentage="progress"
            :stroke-width="6"
            striped
            striped-flow
          />
          <span class="text-sm text-gray-400">
            {{ progressMessage || $t('app.plugin.market.install.installing') }}
          </span>
        </div>
        <div v-else class="flex justify-center gap-3">
          <ElButton @click="handleClose">
            {{ $t('app.plugin.market.install.cancel') }}
          </ElButton>
          <ElButton
            type="primary"
            :loading="installing"
            @click="confirmInstall"
          >
            {{ $t('app.plugin.market.install.confirm') }}
          </ElButton>
        </div>
      </div>
    </ElCard>
  </Dialog>
</template>

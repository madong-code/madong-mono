<script setup lang="ts">
/** 租户插件卸载弹窗 */
import { onUnmounted, ref } from 'vue';

import { ElButton, ElCard, ElIcon, ElMessage, ElProgress } from 'element-plus';
import { TriangleAlert } from 'lucide-vue-next';

import { requestClient, sse } from '#/api/request';
import { useDialog } from '#/components/dialog';
import { $t } from '#/locales';

defineOptions({ name: 'GrantedModuleUninstallDialog' });

const props = defineProps<{ plugin: any }>();

const emit = defineEmits<{ close: []; refresh: [] }>();

const [Dialog, dialogApi] = useDialog({
  title: $t('app.plugin.market.uninstall.title'),
  width: '500px',
  fullscreen: false,
  footer: false,
  draggable: true,
  closeOnClickModal: false,
  destroyOnClose: true,
});

const loading = ref(false);
const uninstalling = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const cleanupItems = ref<any[]>([]);
let sseConn: null | { close: () => void } = null;

const pluginKey = () => props.plugin?.name || props.plugin?.code;

const openDialog = async () => {
  if (!pluginKey()) {
    ElMessage.error($t('app.plugin.market.install.invalid'));
    return;
  }
  loading.value = false;
  uninstalling.value = false;
  progress.value = 0;
  progressMessage.value = '';
  cleanupItems.value = [];
  dialogApi.open();
  try {
    const plan: any = await requestClient.get(
      `/tenant/plugin/${pluginKey()}/cleanup-plan`,
    );
    cleanupItems.value = plan?.items || [];
  } catch (error: any) {
    ElMessage.error(error?.message || $t('app.plugin.market.uninstall.fail'));
  }
};

const finishWithError = (payload?: any) => {
  const eventData = payload?.data || payload;
  ElMessage.error(eventData?.message || $t('app.plugin.market.uninstall.fail'));
  loading.value = false;
  uninstalling.value = false;
  sseConn?.close();
  sseConn = null;
};

const confirmUninstall = () => {
  uninstalling.value = true;
  loading.value = true;
  progress.value = 0;
  progressMessage.value = '开始卸载...';

  sseConn = sse(`/tenant/plugin/${pluginKey()}/uninstall`, {
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
        $t('app.plugin.market.uninstall.success', { name: props.plugin.name }),
      );
      sseConn?.close();
      sseConn = null;
      loading.value = false;
      uninstalling.value = false;
      emit('refresh');
      handleClose();
    },
    error: finishWithError,
    onError: () => {
      if (uninstalling.value) finishWithError();
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
        <ElIcon class="mb-4" :size="48" color="#e6a23c">
          <TriangleAlert />
        </ElIcon>
        <h3 class="text-lg font-medium mb-2">
          {{ $t('app.plugin.market.uninstall.dialog_title') }}
        </h3>
        <p
          class="text-sm text-gray-500 mb-2"
          v-html="
            $t('app.plugin.market.uninstall.confirm_msg', {
              name: plugin?.name,
            })
          "
        ></p>
        <p class="text-sm text-orange-500 mb-6">
          {{ $t('app.plugin.market.uninstall.warning') }}
        </p>
        <ul v-if="cleanupItems.length" class="mb-6 space-y-1 text-left text-sm">
          <li v-for="item in cleanupItems" :key="item.action">
            <strong>{{ item.action }}：</strong>{{ item.detail }}
          </li>
        </ul>
        <div v-if="loading" class="flex flex-col items-center gap-3">
          <ElProgress
            :percentage="progress"
            :stroke-width="6"
            striped
            striped-flow
            status="warning"
          />
          <span class="text-sm text-gray-400">
            {{
              progressMessage || $t('app.plugin.market.uninstall.uninstalling')
            }}
          </span>
        </div>
        <div v-else class="flex justify-center gap-3">
          <ElButton @click="handleClose">
            {{ $t('app.plugin.market.install.cancel') }}
          </ElButton>
          <ElButton
            type="danger"
            :loading="uninstalling"
            @click="confirmUninstall"
          >
            {{ $t('app.plugin.market.uninstall.confirm') }}
          </ElButton>
        </div>
      </div>
    </ElCard>
  </Dialog>
</template>

<script setup lang="ts">
/** 三步卸载对话框：卸载确认 → 卸载进度 → 卸载完成 */
import { nextTick, onUnmounted, ref } from 'vue';

import {
  ElAlert,
  ElButton,
  ElCard,
  ElCheckbox,
  ElMessage,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { AppPluginMarketService } from '#/api/app/plugin/market';
import { sse } from '#/api/request';
import { useDialog } from '#/components/dialog';
import { $t } from '#/locales';

import {
  canProceedWithUninstall,
  requiresUninstallConfirmation,
} from './impact';

defineOptions({ name: 'ModuleUninstallDialog' });

const props = defineProps<{ plugin: any }>();
const emit = defineEmits<{ close: []; refresh: [] }>();

const [Dialog, dialogApi] = useDialog({
  title: $t('app.plugin.market.standalone.uninstall.title'),
  width: '800px',
  fullscreen: false,
  footer: false,
  draggable: true,
  closeOnClickModal: false,
  destroyOnClose: true,
});

const loading = ref(false);
const currentStep = ref(1);
const uninstallProgress = ref(0);
const uninstallStatus = ref<string>('');
const uninstallLogs = ref<string[]>([]);
const uninstallResult = ref<'error' | 'success'>('success');
const impact = ref<any>({ has_impact: false, items: [], total: 0 });
const impactConfirmed = ref(false);
const impactReady = ref(false);
const logsContainer = ref<HTMLElement>();
let sseConn: null | { close: () => void } = null;

const openDialog = async () => {
  if (!props.plugin?.code) {
    ElMessage.error('模块信息不完整');
    return;
  }
  dialogApi.open();
  currentStep.value = 1;
  uninstallProgress.value = 0;
  uninstallStatus.value = '';
  uninstallLogs.value = [];
  uninstallResult.value = 'success';
  impactConfirmed.value = false;
  impactReady.value = false;
  loading.value = true;
  try {
    impact.value = await AppPluginMarketService.getUninstallImpact(
      props.plugin.code,
    );
    impactReady.value = true;
  } catch {
    impact.value = { has_impact: false, items: [], total: 0 };
    ElMessage.error(
      $t('app.plugin.market.standalone.uninstall.impact_load_failed'),
    );
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  sseConn?.close();
  sseConn = null;
  dialogApi.close();
  emit('close');
};
const scrollToBottom = () => {
  nextTick(() => {
    if (logsContainer.value)
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  });
};

const startUninstall = async () => {
  if (!impactReady.value) {
    ElMessage.error(
      $t('app.plugin.market.standalone.uninstall.impact_load_failed'),
    );
    return;
  }
  if (requiresUninstallConfirmation(impact.value) && !impactConfirmed.value) {
    ElMessage.warning(
      $t('app.plugin.market.standalone.uninstall.impact_confirm_required'),
    );
    return;
  }
  currentStep.value = 2;
  uninstallProgress.value = 0;
  uninstallLogs.value = ['开始卸载...'];
  startSseUninstall();
};

const startSseUninstall = () => {
  sseConn = sse(`/plugin/${props.plugin.code}/uninstall?confirmed=1`, {
    open: () => {},
    progress: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData.progress !== undefined)
        uninstallProgress.value = eventData.progress;
      if (eventData.message) {
        uninstallLogs.value.push(eventData.message);
        scrollToBottom();
      }
    },
    completed: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData.message) {
        uninstallLogs.value.push(eventData.message);
        scrollToBottom();
      }
      uninstallStatus.value = 'success';
      currentStep.value = 3;
      uninstallResult.value = 'success';
      sseConn?.close();
      scrollToBottom();
    },
    warning: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData.message) {
        uninstallLogs.value.push(`警告: ${eventData.message}`);
        scrollToBottom();
      }
      uninstallStatus.value = 'warning';
      currentStep.value = 3;
      uninstallResult.value = 'success';
      sseConn?.close();
      scrollToBottom();
    },
    error: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData.message) {
        uninstallLogs.value.push(`错误: ${eventData.message}`);
        uninstallStatus.value = 'exception';
        currentStep.value = 3;
        uninstallResult.value = 'error';
        sseConn?.close();
        scrollToBottom();
      }
    },
    onError: () => {
      if (currentStep.value < 3) {
        uninstallLogs.value.push('SSE连接错误');
        uninstallStatus.value = 'exception';
        currentStep.value = 3;
        uninstallResult.value = 'error';
        sseConn?.close();
        scrollToBottom();
      }
    },
    message: (payload: any) => {
      const eventData = payload?.data || payload;
      if (eventData.message) {
        uninstallLogs.value.push(eventData.message);
        scrollToBottom();
      }
    },
  });
};

const handleRefresh = () => {
  emit('refresh');
  handleClose();
};
onUnmounted(() => {
  sseConn?.close();
});
defineExpose({ openDialog });
</script>

<template>
  <Dialog>
    <ElCard class="box-card !border-none" shadow="never">
      <div v-loading="loading">
        <div class="steps-indicator mb-6">
          <div
            class="step"
            :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
          >
            <div class="step-number">{{ currentStep > 1 ? '✓' : '1' }}</div>
            <div class="step-label">
              {{ $t('app.plugin.market.standalone.uninstall.step1') }}
            </div>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
          <div
            class="step"
            :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
          >
            <div class="step-number">{{ currentStep > 2 ? '✓' : '2' }}</div>
            <div class="step-label">
              {{ $t('app.plugin.market.standalone.uninstall.step2') }}
            </div>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <div class="step-number">{{ currentStep >= 3 ? '✓' : '3' }}</div>
            <div class="step-label">
              {{ $t('app.plugin.market.standalone.uninstall.step3') }}
            </div>
          </div>
        </div>
        <div v-if="currentStep === 1" class="mt-5 uninstall-confirm">
          <ElAlert
            :title="$t('app.plugin.market.standalone.uninstall.step1')"
            type="warning"
            :closable="false"
            show-icon
            class="mb-4"
          >
            <template #default>
              <p class="mb-2">
                {{
                  $t('app.plugin.market.standalone.uninstall.confirm_msg', {
                    name: plugin?.name,
                  })
                }}
              </p>
              <p class="text-sm text-gray-600">
                {{
                  $t('app.plugin.market.standalone.uninstall.operations_title')
                }}
              </p>
              <ul class="text-sm text-gray-600 mt-2 ml-6 list-disc">
                <li>{{ $t('app.plugin.market.standalone.uninstall.op1') }}</li>
                <li>{{ $t('app.plugin.market.standalone.uninstall.op2') }}</li>
                <li>{{ $t('app.plugin.market.standalone.uninstall.op3') }}</li>
                <li>{{ $t('app.plugin.market.standalone.uninstall.op4') }}</li>
                <li>{{ $t('app.plugin.market.standalone.uninstall.op5') }}</li>
              </ul>
              <p class="text-sm text-red-500 mt-2">
                ⚠️
                {{ $t('app.plugin.market.standalone.uninstall.irreversible') }}
              </p>
            </template>
          </ElAlert>
          <div v-if="impact.has_impact" class="impact-panel">
            <div class="mb-3 flex items-center justify-between gap-3">
              <span class="text-sm font-medium">
                {{
                  $t('app.plugin.market.standalone.uninstall.impact_title', {
                    count: impact.total,
                  })
                }}
              </span>
              <ElTag type="danger" effect="plain">
                {{ $t('app.plugin.market.standalone.uninstall.impact_tag') }}
              </ElTag>
            </div>
            <ElTable :data="impact.items" max-height="220" size="small">
              <ElTableColumn
                prop="tenant_name"
                :label="$t('app.plugin.market.standalone.uninstall.tenant')"
                min-width="180"
              />
              <ElTableColumn
                prop="tenant_id"
                :label="$t('app.plugin.market.standalone.uninstall.tenant_id')"
                min-width="150"
              />
              <ElTableColumn
                prop="installed_version"
                :label="
                  $t('app.plugin.market.standalone.uninstall.installed_version')
                "
                width="120"
              />
            </ElTable>
            <ElCheckbox v-model="impactConfirmed" class="mt-3">
              {{ $t('app.plugin.market.standalone.uninstall.impact_confirm') }}
            </ElCheckbox>
          </div>
          <div class="mt-4 flex justify-end">
            <ElButton @click="handleClose">
              {{ $t('app.plugin.market.standalone.uninstall.cancel') }}
            </ElButton>
            <ElButton
              type="danger"
              :disabled="
                !canProceedWithUninstall(impact, impactConfirmed, impactReady)
              "
              @click="startUninstall"
            >
              {{
                $t('app.plugin.market.standalone.uninstall.confirm_uninstall')
              }}
            </ElButton>
          </div>
        </div>
        <div v-else-if="currentStep === 2" class="uninstall-progress mt-5">
          <ElProgress
            :percentage="uninstallProgress"
            :status="uninstallStatus as any"
          />
          <div class="mt-4">
            <div ref="logsContainer" class="uninstall-logs">
              <div
                v-for="(log, idx) in uninstallLogs"
                :key="idx"
                class="text-sm mb-1"
              >
                {{ log }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentStep === 3" class="uninstall-complete">
          <p class="text-sm font-medium text-gray-700 mb-2">
            {{ $t('app.plugin.market.standalone.uninstall.log_title') }}：
          </p>
          <div ref="logsContainer" class="uninstall-logs">
            <div
              v-for="(log, idx) in uninstallLogs"
              :key="idx"
              class="text-sm mb-1"
              :class="{
                'text-green-400':
                  idx === uninstallLogs.length - 1 &&
                  uninstallResult === 'success',
                'text-red-400':
                  idx === uninstallLogs.length - 1 &&
                  uninstallResult === 'error',
              }"
            >
              {{ log }}
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <ElButton @click="handleClose">
              {{ $t('app.plugin.market.standalone.uninstall.close') }}
            </ElButton>
            <ElButton
              v-if="uninstallResult === 'success'"
              type="primary"
              @click="handleRefresh"
            >
              {{ $t('app.plugin.market.standalone.uninstall.refresh') }}
            </ElButton>
          </div>
        </div>
      </div>
    </ElCard>
  </Dialog>
</template>

<style scoped>
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
}

.impact-panel {
  padding: 16px;
  background: var(--el-color-danger-light-9);
  border: 1px solid var(--el-color-danger-light-5);
  border-radius: 6px;
}

.step {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
  background-color: #e0e0e0;
  border-radius: 50%;
  transition: all 0.3s;
}

.step-label {
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.step.active .step-number {
  color: white;
  background-color: #409eff;
}

.step.active .step-label {
  font-weight: 500;
  color: #409eff;
}

.step.completed .step-number {
  color: white;
  background-color: #67c23a;
}

.step.completed .step-label {
  color: #67c23a;
}

.step-line {
  flex: 1;
  height: 2px;
  margin: 0 10px 24px;
  background-color: #e0e0e0;
  transition: all 0.3s;
}

.step-line.completed {
  background-color: #67c23a;
}

.uninstall-logs {
  max-height: 200px;
  padding: 10px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #d4d4d4;
  background-color: #1e1e1e;
  border-radius: 4px;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-dialog__header) {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

:deep(.el-dialog__header .el-dialog__title) {
  color: white;
}
</style>

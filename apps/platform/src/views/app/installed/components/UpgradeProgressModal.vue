<script setup lang="ts">
/**
 * UpgradeProgressModal - 插件升级 SSE 进度弹窗
 *
 * 独立弹窗负责：打开后发起 SSE、实时渲染进度条与日志、关闭时刷新矩阵。
 */
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ElButton, ElProgress } from 'element-plus';

import { sse } from '#/api/request';
import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { usePluginMatrix } from '#/composables/usePluginMatrix';
import { $t } from '#/locales';

defineOptions({ name: 'UpgradeProgressModal' });

const { refreshAll } = usePluginMatrix();

const code = ref('');
const version = ref('');
const force = ref(false);
const tenantPayload = ref<any>({});

const phase = ref<'idle' | 'running' | 'done' | 'error'>('idle');
const pct = ref(0);
const logs = ref<{ ts: number; level: 'info' | 'error'; msg: string }[]>([]);

let sseConn: { close: () => void } | null = null;

const [Modal, modalApi] = useVbenModal({
  title: $t('app.plugin.distribution.upgrade.progress_title'),
  class: '!w-[620px]',
  draggable: true,
  showConfirmButton: false,
  showCancelButton: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      code.value = data?.code || '';
      version.value = data?.version || '';
      force.value = !!data?.force;
      tenantPayload.value = data?.tenantPayload || {};
      startSse();
    } else {
      closeSse();
    }
  },
  onClosed() {
    refreshAll();
  },
});

const closeSse = () => {
  sseConn?.close();
  sseConn = null;
};

const pushLog = (level: 'info' | 'error', msg: string) => {
  logs.value.push({ ts: Date.now(), level, msg });
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const startSse = () => {
  if (!code.value || !version.value) return;
  closeSse();
  phase.value = 'running';
  pct.value = 0;
  logs.value = [];

  const payload = {
    code: code.value,
    version: version.value,
    force: force.value,
    ...tenantPayload.value,
  };
  const url = AppPluginDelegationService.getUpgradeStreamUrl(payload);

  const handleChunk = (p: any) => {
    const inner = p?.data ?? {};
    if (typeof inner.progress === 'number') pct.value = inner.progress;
    if (inner.message) {
      pushLog(inner.data?.result === 'failed' ? 'error' : 'info', inner.message);
    }
  };

  sseConn = sse(url, {
    progress: handleChunk,
    completed: (p: any) => {
      const inner = p?.data ?? {};
      if (inner.message) pushLog('info', inner.message);
      phase.value = 'done';
      closeSse();
      // 升级完成的瞬间即刷新共享矩阵 => 抽屉表格 + "我的应用" 页面同步更新
      refreshAll();
    },
    error: (p: any) => {
      const inner = p?.data ?? {};
      pushLog('error', inner.message || $t('app.plugin.distribution.upgrade.msg_fail'));
      phase.value = 'error';
      closeSse();
      // 即便失败也刷新一次, 让版本状态 / 父级卡片回到最新
      refreshAll();
    },
    onError: () => {
      if (phase.value === 'running') {
        pushLog('error', $t('app.plugin.distribution.upgrade.interrupt'));
        phase.value = 'error';
      }
    },
  });
};

const handleClose = () => {
  modalApi.close();
};
</script>

<template>
  <Modal>
    <div class="progress-body">
      <div class="progress-head">
        <ElProgress
          :percentage="pct"
          :status="
            phase === 'error'
              ? 'exception'
              : phase === 'done'
                ? 'success'
                : ''
          "
          :stroke-width="14"
          class="stream-progress"
        />
        <span class="stream-phase" :class="phase">
          {{
            phase === 'running'
              ? $t('app.plugin.distribution.upgrade.processing')
              : phase === 'done'
                ? $t('app.plugin.distribution.upgrade.completed')
                : phase === 'error'
                  ? $t('app.plugin.distribution.upgrade.failed')
                  : ''
          }}
        </span>
      </div>
      <div class="stream-logs">
        <div
          v-for="(log, i) in logs"
          :key="i"
          class="log-line"
          :class="log.level"
        >
          <span class="log-time">{{ formatTime(log.ts) }}</span>
          <span class="log-msg">{{ log.msg }}</span>
        </div>
        <div v-if="logs.length === 0" class="log-empty">
          {{ $t('app.plugin.distribution.upgrade.waiting') }}
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="handleClose">
        {{ $t('app.plugin.distribution.upgrade.close') }}
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.progress-body {
  padding: 4px 0;
}
.progress-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.stream-progress {
  flex: 1;
}
.stream-phase {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.stream-phase.running {
  color: var(--el-color-primary);
}
.stream-phase.done {
  color: var(--el-color-success);
}
.stream-phase.error {
  color: var(--el-color-danger);
}
.stream-logs {
  max-height: 320px;
  overflow: auto;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  padding: 10px;
  font-size: 12px;
}
.log-line {
  display: flex;
  gap: 8px;
  padding: 1px 0;
  font-family: monospace;
}
.log-line.error {
  color: var(--el-color-danger);
}
.log-time {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}
.log-msg {
  word-break: break-all;
}
.log-empty {
  color: var(--el-text-color-secondary);
}
</style>

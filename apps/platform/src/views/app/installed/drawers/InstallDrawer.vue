<script setup lang="ts">
/**
 * InstallContent - 远程安装内容 (useVbenDrawer 标准模式)
 *  - 把平台已安装的插件以租户模式推送到勾选的租户
 *  - 租户列表(表格)仅展示该插件已授权且未安装的租户
 *  - 安装范围按各租户隔离模式自动决定: 字段隔离=仅菜单, 库隔离=菜单+数据库
 *  - 表格 + 勾选 参考 AuthorizeDrawer
 */
import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElPagination,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { CloudDownload, Package } from 'lucide-vue-next';

import { sse } from '#/api/request';
import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { usePluginMatrix } from '#/composables/usePluginMatrix';
import { $t } from '#/locales';

defineOptions({ name: 'InstallContent' });

const { matrix, refreshAll } = usePluginMatrix();

const prefillName = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  title: $t('app.installed.drawer.install.title'),
  placement: 'right',
  class: '!w-[70vw] !max-w-[1100px]',
  footer: false,
  destroyOnClose: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ prefillName?: string }>();
      prefillName.value = data?.prefillName || '';
      form.value.name = prefillName.value;
      selected.value = new Set();
      page.value = 1;
      if (!matrix.value) {
        await refreshAll();
      }
    }
  },
  onClosed() {
    refreshAll();
  },
});

const form = ref({ name: '' });

watch(() => form.value.name, () => {
  selected.value = new Set();
});

/** 该插件已授权的租户（含已安装，已安装项禁用勾选） */
const tenantRows = computed(() => {
  if (!matrix.value || !form.value.name) return [];
  const { tenants, matrix: m } = matrix.value;
  const pk = form.value.name;
  return tenants
    .map((t) => {
      const cell = m[pk]?.[String(t.id)] || null;
      const isInstalled = !!cell && cell.is_installed === 1;
      return {
        tenant_id: t.id,
        tenant_code: t.code,
        tenant_name: t.name,
        expired_at: t.expired_at,
        database_mode: t.database_mode,
        auth_status: cell?.auth_status || 'ungranted',
        is_purchased: cell?.is_purchased ? 1 : 0,
        is_installed: isInstalled,
        version: cell?.version || null,
      };
    })
    .filter((r) => r.auth_status === 'authorized' || r.is_purchased === 1);
});

/** 可安装（未安装）的租户 */
const installableRows = computed(() => tenantRows.value.filter((r) => !r.is_installed));

/** 租户列表变化时，自动清理已不在可安装集合中的选中项 */
watch(tenantRows, () => {
  const installableIds = new Set(installableRows.value.map((r) => String(r.tenant_id)));
  let changed = false;
  for (const tid of Array.from(selected.value)) {
    if (!installableIds.has(tid)) {
      selected.value.delete(tid);
      changed = true;
    }
  }
  if (changed) selected.value = new Set(selected.value);
});

// 前端分页
const page = ref(1);
const pageSize = ref(8);
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return tenantRows.value.slice(start, start + pageSize.value);
});

const selected = ref<Set<string>>(new Set());
const toggle = (row: any, v: boolean) => {
  if (row.is_installed) return;
  const tid = String(row.tenant_id);
  if (v) selected.value.add(tid);
  else selected.value.delete(tid);
  selected.value = new Set(selected.value);
};
const toggleAll = (v: boolean) => {
  selected.value = v
    ? new Set(installableRows.value.map((r) => String(r.tenant_id)))
    : new Set();
};
const allChecked = computed(
  () => installableRows.value.length > 0 && selected.value.size === installableRows.value.length,
);
const isIndeterminate = computed(
  () => selected.value.size > 0 && selected.value.size < installableRows.value.length,
);

const AUTH_TYPE: Record<string, 'success' | 'primary' | 'info' | 'danger'> = {
  authorized: 'success',
  trial: 'primary',
  ungranted: 'info',
  expired: 'danger',
};
const AUTH_LABEL: Record<string, string> = {
  authorized: 'app.installed.auth_status.authorized',
  trial: 'app.installed.auth_status.trial',
  ungranted: 'app.installed.auth_status.ungranted',
  expired: 'app.installed.auth_status.expired',
};

// ──────────────────────────────────────────────
// SSE 进度 (对勾选租户逐个顺序安装)
// ──────────────────────────────────────────────
const progressVisible = ref(false);
const pct = ref(0);
const phase = ref<'idle' | 'running' | 'done' | 'error'>('idle');
const logs = ref<{ ts: number; msg: string }[]>([]);
const submitting = ref(false);
let es: { close: () => void } | null = null;
const currentIndex = ref(0);
const totalSelected = ref(0);
const failedCount = ref(0);

const resetProgress = () => {
  logs.value = [];
  pct.value = 0;
  phase.value = 'idle';
  closeES();
};
const closeES = () => {
  if (es) {
    es.close();
    es = null;
  }
};

/** 对单个租户执行 SSE 安装, 完成后 resolve */
const runOne = (tenantId: string, withDatabase: boolean) =>
  new Promise<void>((resolve) => {
    const url = AppPluginDelegationService.getTenantInstallUrl({
      name: form.value.name,
      tenant_id: tenantId,
      with_database: withDatabase,
    });
    const finish = () => {
      closeES();
      resolve();
    };
    es = sse(url, {
      start: () => {
        /* 日志由 start() 统一写入 */
      },
      progress: (p: any) => {
        const inner = (p?.pct || 0) as number;
        pct.value = Math.min(
          99,
          Math.round(((currentIndex.value - 1) + inner / 100) / totalSelected.value * 100),
        );
        if (p?.data?.msg) logs.value.push({ ts: Date.now(), msg: p.data.msg });
      },
      heartbeat: () => {
        /* ignore */
      },
      done: (p: any) => {
        if (p?.data?.msg) logs.value.push({ ts: Date.now(), msg: '✅ ' + p.data.msg });
        finish();
      },
      error: (p: any) => {
        logs.value.push({ ts: Date.now(), msg: '❌ ' + (p?.data?.msg || $t('app.installed.drawer.install.log_fail')) });
        failedCount.value += 1;
        finish();
      },
      onError: () => {
        logs.value.push({ ts: Date.now(), msg: '❌ ' + $t('app.installed.drawer.install.log_interrupt') });
        failedCount.value += 1;
        finish();
      },
    });
  });

const start = async () => {
  if (!form.value.name || selected.value.size === 0) return;
  const installableIds = new Set(installableRows.value.map((r) => String(r.tenant_id)));
  const ids = Array.from(selected.value).filter((tid) => installableIds.has(tid));
  if (ids.length === 0) return;
  totalSelected.value = ids.length;
  currentIndex.value = 0;
  failedCount.value = 0;
  progressVisible.value = true;
  resetProgress();
  phase.value = 'running';
  submitting.value = true;
  await nextTick();
  for (const tid of ids) {
    currentIndex.value += 1;
    const tenant = matrix.value?.tenants.find((x) => String(x.id) === tid);
    const withDb = tenant?.database_mode === 'database';
    logs.value.push({
      ts: Date.now(),
      msg: $t('app.installed.drawer.install.log_installing', {
        name: tenant?.name ?? tid,
        mode: withDb
          ? $t('app.installed.isolation.database')
          : $t('app.installed.isolation.field'),
      }),
    });
    const failedBefore = failedCount.value;
    await runOne(tid, withDb);
    if (failedCount.value === failedBefore) {
      selected.value.delete(tid);
    }
  }
  submitting.value = false;
  phase.value = failedCount.value === 0 ? 'done' : 'error';
  pct.value = 100;
  if (failedCount.value === 0) {
    ElMessage.success($t('app.installed.drawer.install.msg_success', { count: ids.length }));
  } else {
    ElMessage.warning($t('app.installed.drawer.install.msg_partial', { count: ids.length, failed: failedCount.value }));
  }
  await refreshAll();
};

const closeProgress = () => {
  if (submitting.value) {
    closeES();
    submitting.value = false;
  }
  progressVisible.value = false;
};
</script>

<template>
  <Drawer>
    <div class="content-body">
      <ElForm label-width="100px" class="install-form">
        <ElFormItem :label="$t('app.installed.drawer.install.plugin_key')" required>
          <ElInput v-model="form.name" :placeholder="$t('app.installed.drawer.install.plugin_key_placeholder')" clearable>
            <template #prefix>
              <ElIcon><Package /></ElIcon>
            </template>
          </ElInput>
        </ElFormItem>
      </ElForm>
      <div class="form-tip">
        {{ $t('app.installed.drawer.install.tip') }}
      </div>

      <div class="toolbar">
        <ElCheckbox
          :model-value="allChecked"
          :indeterminate="isIndeterminate"
          @update:model-value="toggleAll(!!$event)"
        >
          {{ $t('app.installed.drawer.install.select_all', { selected: selected.size, total: installableRows.length }) }}
        </ElCheckbox>
        <div class="toolbar-right">
          <ElButton
            type="primary"
            :icon="CloudDownload"
            :loading="submitting"
            :disabled="selected.size === 0"
            @click="start"
          >
            {{ $t('app.installed.drawer.install.install_btn', { count: selected.size }) }}
          </ElButton>
        </div>
      </div>

      <ElEmpty
        v-if="!form.name"
        :description="$t('app.installed.drawer.install.empty_key')"
      />
      <ElEmpty
        v-else-if="!matrix"
        :description="$t('app.installed.drawer.install.loading')"
      />
      <ElEmpty
        v-else-if="tenantRows.length === 0"
        :description="$t('app.installed.drawer.install.empty_no_tenant', { plugin: form.name })"
      />
      <template v-else>
        <div class="table-area">
          <ElTable
            :data="pagedRows"
            stripe
            height="100%"
            :row-class-name="(row: any) => (row.is_installed ? 'is-installed' : '')"
          >
            <ElTableColumn width="50" align="center">
              <template #default="{ row }">
                <ElCheckbox
                  :model-value="selected.has(String(row.tenant_id))"
                  :disabled="row.is_installed"
                  @update:model-value="toggle(row, !!$event)"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn prop="tenant_code" :label="$t('app.installed.drawer.install.col_code')" min-width="140" />
            <ElTableColumn prop="tenant_name" :label="$t('app.installed.drawer.install.col_name')" min-width="160" />
            <ElTableColumn :label="$t('app.installed.drawer.install.col_status')" width="100" align="center">
              <template #default="{ row }">
                <ElTag :type="AUTH_TYPE[row.auth_status] || 'info'" effect="dark" size="small">
                  {{ $t(AUTH_LABEL[row.auth_status] || row.auth_status) }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn :label="$t('app.installed.drawer.install.col_isolation')" width="100" align="center">
              <template #default="{ row }">
                <ElTag :type="row.database_mode === 'database' ? 'warning' : 'info'" size="small">
                  {{ row.database_mode === 'database' ? $t('app.installed.isolation.database') : $t('app.installed.isolation.field') }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn :label="$t('app.installed.drawer.install.col_version')" width="120" align="center">
              <template #default="{ row }">
                <ElTag v-if="row.is_installed" type="success" size="small">
                  {{ row.version || '—' }}
                </ElTag>
                <span v-else class="text-gray">—</span>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <div class="pagination">
          <ElPagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="tenantRows.length"
            :page-sizes="[8, 16, 32, 64]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            small
          />
        </div>
      </template>

      <ElDialog
        v-model="progressVisible"
        :title="$t('app.installed.drawer.install.progress_title')"
        width="640px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="!submitting"
        :draggable="true"
        @close="closeProgress"
      >
        <div class="install-progress">
          <div class="install-counter">
            {{ currentIndex > 0 ? $t('app.installed.drawer.install.progress_counter', { current: currentIndex, total: totalSelected }) : $t('app.installed.drawer.install.progress_preparing') }}
          </div>
          <ElProgress
            :percentage="pct"
            :status="
              phase === 'done' ? 'success' : phase === 'error' ? 'exception' : undefined
            "
            :stroke-width="14"
          />
          <div class="install-phase">
            <ElTag v-if="phase === 'running'" type="primary" effect="dark">{{ $t('app.installed.drawer.install.phase_running') }}</ElTag>
            <ElTag v-else-if="phase === 'done'" type="success" effect="dark">{{ $t('app.installed.drawer.install.phase_done') }}</ElTag>
            <ElTag v-else-if="phase === 'error'" type="danger" effect="dark">{{ $t('app.installed.drawer.install.phase_error') }}</ElTag>
          </div>
          <pre class="install-log">
            {{ logs.map((l) => '[' + new Date(l.ts).toLocaleTimeString() + '] ' + l.msg).join('\n') }}
          </pre>
        </div>
        <template #footer>
          <ElButton v-if="!submitting" type="primary" @click="closeProgress">{{ $t('app.installed.drawer.install.close') }}</ElButton>
        </template>
      </ElDialog>
    </div>
  </Drawer>
</template>

<style scoped>
.content-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 14px 20px;
}
.install-form {
  padding: 0;
}
.form-tip {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
.table-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0 10px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
  margin-bottom: 10px;
}
.toolbar-right {
  display: flex;
  gap: 8px;
}
.text-gray {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.install-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.install-counter {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.install-phase {
  display: flex;
  justify-content: center;
}
.install-log {
  max-height: 320px;
  overflow: auto;
  background: var(--el-fill-color-light);
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>

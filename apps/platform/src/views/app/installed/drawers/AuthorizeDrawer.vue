<script setup lang="ts">
/**
 * AuthorizeContent - 租户授权内容 (useVbenDrawer 标准模式)
 *  - 自身 useVbenDrawer 拿注入 api,onOpenChange 时 getData() 读 pluginKey
 *  - 主页 useVbenDrawer({ connectedComponent: AuthorizeContent })
 */
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useVbenDrawer } from '@vben/common-ui';
import {
  ElButton,
  ElCheckbox,
  ElEmpty,
  ElMessage,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElTag,
  ElMessageBox,
} from 'element-plus';
import { Ban, Key, ShieldCheck } from 'lucide-vue-next';

import { usePluginMatrix } from '#/composables/usePluginMatrix';
import { AppPluginDelegationService } from '#/api/app/plugin/delegation';

defineOptions({ name: 'AuthorizeContent' });

const { t } = useI18n();

const { matrix, refreshAll } = usePluginMatrix();

const STATUS_TYPE: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
  latest: 'success',
  outdated: 'warning',
  trial: 'primary',
  ungranted: 'info',
  empty: 'info',
};
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
const AUTH_ACTION: Record<string, string> = {
  authorized: 'app.installed.drawer.authorize.set_authorized',
  trial: 'app.installed.drawer.authorize.set_trial',
  ungranted: 'app.installed.drawer.authorize.cancel_auth',
};

const pluginKey = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  title: t('app.installed.drawer.authorize.title'),
  placement: 'right',
  // vben Drawer 用 class 控宽度, contentClass 只影响内层
  class: '!w-[70vw] !max-w-[1100px]',
  footer: false,
  destroyOnClose: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ pluginKey: string }>();
      pluginKey.value = data?.pluginKey || '';
      // 每次打开都确保 matrix 是最新数据 (避免首次打开时 matrix 还在加载中导致空白)
      if (!matrix.value) {
        await refreshAll();
      }
    }
  },
  onClosed() {
    refreshAll();
  },
});

const tenantRows = computed(() => {
  if (!matrix.value || !pluginKey.value) return [];
  const { tenants, matrix: m } = matrix.value;
  const pk = pluginKey.value;
  return tenants.map((t) => {
    const cell = m[pk]?.[String(t.id)] || null;
    return {
      tenant_id: t.id,
      tenant_code: t.code,
      tenant_name: t.name,
      expired_at: t.expired_at,
      version: cell?.version || null,
      auth_status: cell?.auth_status || 'ungranted',
    };
  });
});

// 前端分页 (租户数一般 < 50, 一页 8 行够用)
const page = ref(1);
const pageSize = ref(8);
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return tenantRows.value.slice(start, start + pageSize.value);
});

const selected = ref<Set<string>>(new Set());
const toggle = (tid: string, v: boolean) => {
  if (v) selected.value.add(tid);
  else selected.value.delete(tid);
  selected.value = new Set(selected.value);
};
const toggleAll = (v: boolean) => {
  selected.value = v
    ? new Set(tenantRows.value.map((r) => String(r.tenant_id)))
    : new Set();
};
const allChecked = computed(
  () => tenantRows.value.length > 0 && selected.value.size === tenantRows.value.length,
);
const isIndeterminate = computed(
  () => selected.value.size > 0 && selected.value.size < tenantRows.value.length,
);

const submitting = ref(false);
type AuthStatus = 'authorized' | 'trial' | 'ungranted' | 'expired';

const apply = async (authStatus: AuthStatus) => {
  if (!pluginKey.value) return;
  if (selected.value.size === 0) {
    ElMessage.warning(t('app.installed.drawer.authorize.please_select'));
    return;
  }
  const actionLabel = t(AUTH_ACTION[authStatus] || authStatus);
  submitting.value = true;
  try {
    const ids = Array.from(selected.value);
    // 1 次请求搞定 (后端 store() 循环处理每个租户)
    const res = await AppPluginDelegationService.setTenantAuth({
      tenant_ids: ids,
      plugin_keys: [pluginKey.value],
      auth_status: authStatus,
    });
    const data = res?.data ?? res;
    const success = data?.success ?? ids.length;
    const failed  = data?.failed ?? [];
    if (failed.length > 0) {
      ElMessage.warning(
        t('app.installed.drawer.authorize.partial', {
          action: actionLabel,
          success,
          total: ids.length,
          failed: failed.length,
        }),
      );
    } else {
      ElMessage.success(
        t('app.installed.drawer.authorize.success', {
          action: actionLabel,
          success,
          status: t(AUTH_LABEL[authStatus] || authStatus),
        }),
      );
    }
    selected.value = new Set();
    await refreshAll();
  } finally {
    submitting.value = false;
  }
};

const cancelAuth = () => {
  // 二次确认 (取消 = 业务上的"未授权",有数据风险)
  ElMessageBox.confirm(
    t('app.installed.drawer.authorize.cancel_confirm_msg', {
      count: selected.value.size,
      plugin: pluginKey.value,
    }),
    t('app.installed.drawer.authorize.cancel_confirm_title'),
    {
      type: 'warning',
      confirmButtonText: t('app.installed.drawer.authorize.confirm_cancel'),
      cancelButtonText: t('app.installed.drawer.authorize.back'),
    },
  )
    .then(() => apply('ungranted'))
    .catch(() => {});
};
</script>

<template>
  <Drawer>
    <div class="content-body">
      <div class="toolbar">
        <ElCheckbox
          :model-value="allChecked"
          :indeterminate="isIndeterminate"
          @update:model-value="toggleAll(!!$event)"
        >
          {{ $t('app.installed.drawer.authorize.select_all', { selected: selected.size, total: tenantRows.length }) }}
        </ElCheckbox>
        <div class="toolbar-right">
          <ElButton
            type="success"
            :icon="ShieldCheck"
            :loading="submitting"
            :disabled="selected.size === 0"
            @click="apply('authorized')"
          >
            {{ $t('app.installed.drawer.authorize.set_authorized') }}
          </ElButton>
          <ElButton
            type="primary"
            :icon="Key"
            :loading="submitting"
            :disabled="selected.size === 0"
            @click="apply('trial')"
          >
            {{ $t('app.installed.drawer.authorize.set_trial') }}
          </ElButton>
          <ElButton
            type="danger"
            plain
            :icon="Ban"
            :loading="submitting"
            :disabled="selected.size === 0"
            @click="cancelAuth"
          >
            {{ $t('app.installed.drawer.authorize.cancel_auth') }}
          </ElButton>
        </div>
      </div>

      <ElEmpty
        v-if="!loading && tenantRows.length === 0"
        :description="pluginKey ? $t('app.installed.drawer.authorize.empty', { plugin: pluginKey }) : $t('app.installed.drawer.authorize.loading')"
      />
      <template v-else-if="tenantRows.length">
        <div class="table-area">
          <ElTable :data="pagedRows" stripe height="100%">
          <ElTableColumn width="50" align="center">
            <template #default="{ row }">
              <ElCheckbox
                :model-value="selected.has(String(row.tenant_id))"
                @update:model-value="toggle(String(row.tenant_id), !!$event)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="tenant_code" :label="$t('app.installed.drawer.authorize.col_code')" min-width="140" />
          <ElTableColumn prop="tenant_name" :label="$t('app.installed.drawer.authorize.col_name')" min-width="160" />
          <ElTableColumn :label="$t('app.installed.drawer.authorize.col_status')" width="120" align="center">
            <template #default="{ row }">
              <ElTag :type="AUTH_TYPE[row.auth_status] || 'info'" effect="dark" size="small">
                {{ $t(AUTH_LABEL[row.auth_status] || row.auth_status) }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('app.installed.drawer.authorize.col_version')" width="120" align="center">
            <template #default="{ row }">
              <span class="mono">{{ row.version || '—' }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('app.installed.drawer.authorize.col_expired')" width="160" align="center">
            <template #default="{ row }">
              <span class="text-gray">{{ row.expired_at || '—' }}</span>
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
      <div v-else class="loading-tip">正在加载...</div>
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
.mono {
  font-family: monospace;
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
</style>

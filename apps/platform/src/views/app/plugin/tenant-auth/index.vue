<script setup lang="ts">
import type {
  PluginAuthStatus,
  TenantPluginAuthRow,
} from '#/api/app/plugin/tenant-auth';
import type { TenantRow } from '#/api/tenant/account/types';

import { computed, onMounted, ref } from 'vue';

import {
  ElButton,
  ElEmpty,
  ElMessage,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { RefreshCw, Save, ShieldCheck } from 'lucide-vue-next';

import { AppPluginTenantAuthService } from '#/api/app/plugin/tenant-auth';
import { TenantService } from '#/api/tenant/account';
import { Page } from '#/components/page';
import { $t } from '#/locales';

import {
  applyAuthorizationStatus,
  hasAuthorizationChanges,
} from './authorization';

defineOptions({ name: 'PlatformPluginTenantAuthList' });

const tenants = ref<TenantRow[]>([]);
const tenantId = ref('');
const rows = ref<TenantPluginAuthRow[]>([]);
const selectedRows = ref<TenantPluginAuthRow[]>([]);
const originalStatuses = ref<Record<string, PluginAuthStatus>>({});
const batchStatus = ref<PluginAuthStatus>('authorized');
const tenantLoading = ref(false);
const tableLoading = ref(false);
const saving = ref(false);
let requestId = 0;

const hasChanges = computed(() =>
  hasAuthorizationChanges(rows.value, originalStatuses.value),
);

const statusType = (status: PluginAuthStatus) => {
  if (status === 'authorized') return 'success';
  if (status === 'trial') return 'warning';
  return 'info';
};

const statusText = (status: PluginAuthStatus) =>
  $t(`app.plugin.tenant_auth.status.${status}`);

const currentStatus = (row: TenantPluginAuthRow) =>
  originalStatuses.value[row.plugin_key] || 'none';

const loadTenants = async () => {
  tenantLoading.value = true;
  try {
    const response = await TenantService.list({ limit: 9999 });
    tenants.value = (response?.items || response || []).map(
      (tenant: TenantRow) => ({
        ...tenant,
        id: String(tenant.id),
      }),
    );
    if (!tenantId.value && tenants.value.length > 0) {
      tenantId.value = String(
        tenants.value.find((tenant) => tenant.status === 'active')?.id ||
          tenants.value[0]?.id,
      );
      await loadAuthorizations();
    }
  } catch (error: any) {
    ElMessage.error(
      error?.message || $t('app.plugin.tenant_auth.message.tenant_failed'),
    );
  } finally {
    tenantLoading.value = false;
  }
};

const loadAuthorizations = async () => {
  const currentRequestId = ++requestId;
  rows.value = [];
  selectedRows.value = [];
  originalStatuses.value = {};
  if (!tenantId.value) return;

  tableLoading.value = true;
  try {
    const response = await AppPluginTenantAuthService.getList(tenantId.value);
    if (currentRequestId !== requestId) return;
    rows.value = response.items || [];
    originalStatuses.value = Object.fromEntries(
      rows.value.map((row) => [row.plugin_key, row.auth_status]),
    );
  } catch (error: any) {
    if (currentRequestId !== requestId) return;
    ElMessage.error(
      error?.message || $t('app.plugin.tenant_auth.message.load_failed'),
    );
  } finally {
    if (currentRequestId === requestId) tableLoading.value = false;
  }
};

const handleTenantChange = () => loadAuthorizations();

const handleSelectionChange = (selection: TenantPluginAuthRow[]) => {
  selectedRows.value = selection;
};

const applyBatchStatus = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning($t('app.plugin.tenant_auth.message.select_plugin'));
    return;
  }
  applyAuthorizationStatus(selectedRows.value, batchStatus.value);
};

const saveAuthorizations = async () => {
  if (!tenantId.value) return;
  saving.value = true;
  try {
    await AppPluginTenantAuthService.save({
      tenant_id: tenantId.value,
      authorizations: rows.value.map((row) => ({
        plugin_key: row.plugin_key,
        auth_status: row.auth_status,
      })),
    });
    ElMessage.success($t('app.plugin.tenant_auth.message.save_success'));
    await loadAuthorizations();
  } catch (error: any) {
    ElMessage.error(
      error?.message || $t('app.plugin.tenant_auth.message.save_failed'),
    );
  } finally {
    saving.value = false;
  }
};

const refresh = async () => {
  await loadAuthorizations();
};

onMounted(loadTenants);
</script>

<template>
  <Page auto-content-height>
    <template #header>
      <div>
        <h2 class="text-xl font-semibold">
          {{ $t('app.plugin.tenant_auth.title') }}
        </h2>
      </div>
    </template>

    <div class="flex h-full min-h-0 flex-col gap-4">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex min-w-64 flex-col gap-1.5">
            <span class="text-sm font-medium">
              {{ $t('app.plugin.tenant_auth.tenant') }}
            </span>
            <ElSelect
              v-model="tenantId"
              class="w-72 max-w-full"
              filterable
              :loading="tenantLoading"
              :placeholder="$t('app.plugin.tenant_auth.tenant_placeholder')"
              @change="handleTenantChange"
            >
              <ElOption
                v-for="tenant in tenants"
                :key="String(tenant.id)"
                :label="`${tenant.name} (${tenant.code})`"
                :value="String(tenant.id)"
              />
            </ElSelect>
          </label>

          <div class="flex items-end gap-2">
            <label class="flex flex-col gap-1.5">
              <span class="text-sm font-medium">
                {{ $t('app.plugin.tenant_auth.batch_status') }}
              </span>
              <ElSelect v-model="batchStatus" class="w-36">
                <ElOption
                  :label="statusText('authorized')"
                  value="authorized"
                />
                <ElOption :label="statusText('trial')" value="trial" />
                <ElOption :label="statusText('none')" value="none" />
              </ElSelect>
            </label>
            <ElButton
              :disabled="selectedRows.length === 0"
              @click="applyBatchStatus"
            >
              <ShieldCheck :size="16" />
              {{ $t('app.plugin.tenant_auth.apply') }}
            </ElButton>
          </div>
        </div>

        <div class="flex gap-2">
          <ElButton
            :aria-label="$t('app.plugin.tenant_auth.refresh')"
            :title="$t('app.plugin.tenant_auth.refresh')"
            :disabled="!tenantId"
            circle
            @click="refresh"
          >
            <RefreshCw :size="16" />
          </ElButton>
          <ElButton
            v-access:code="['platform:plugin:tenant-auth:store']"
            type="primary"
            :disabled="!tenantId || !hasChanges"
            :loading="saving"
            @click="saveAuthorizations"
          >
            <Save :size="16" />
            {{ $t('app.plugin.tenant_auth.save') }}
          </ElButton>
        </div>
      </div>

      <ElTable
        v-if="tenantId"
        v-loading="tableLoading"
        :data="rows"
        row-key="plugin_key"
        border
        class="min-h-0 flex-1"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" width="48" />
        <ElTableColumn
          :label="$t('app.plugin.tenant_auth.columns.plugin')"
          min-width="240"
        >
          <template #default="{ row }">
            <div class="min-w-0 py-1">
              <div class="truncate font-medium">{{ row.plugin_title }}</div>
              <div class="text-muted-foreground truncate text-xs">
                {{ row.plugin_key }}
              </div>
              <div
                v-if="row.description"
                class="text-muted-foreground mt-1 line-clamp-1 text-xs"
              >
                {{ row.description }}
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="version"
          :label="$t('app.plugin.tenant_auth.columns.platform_version')"
          width="130"
        />
        <ElTableColumn
          :label="$t('app.plugin.tenant_auth.columns.installation')"
          width="160"
        >
          <template #default="{ row }">
            <div class="flex flex-col items-start gap-1">
              <ElTag :type="row.is_installed ? 'success' : 'info'" size="small">
                {{
                  row.is_installed
                    ? $t('app.plugin.tenant_auth.installed')
                    : $t('app.plugin.tenant_auth.not_installed')
                }}
              </ElTag>
              <span
                v-if="row.installed_version"
                class="text-muted-foreground text-xs"
              >
                v{{ row.installed_version }}
              </span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="$t('app.plugin.tenant_auth.columns.current_status')"
          width="110"
        >
          <template #default="{ row }">
            <ElTag :type="statusType(currentStatus(row))" size="small">
              {{ statusText(currentStatus(row)) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="$t('app.plugin.tenant_auth.columns.authorization')"
          width="160"
        >
          <template #default="{ row }">
            <ElSelect v-model="row.auth_status">
              <ElOption :label="statusText('authorized')" value="authorized" />
              <ElOption :label="statusText('trial')" value="trial" />
              <ElOption :label="statusText('none')" value="none" />
            </ElSelect>
          </template>
        </ElTableColumn>
        <template #empty>
          <ElEmpty :description="$t('app.plugin.tenant_auth.empty_plugins')" />
        </template>
      </ElTable>

      <ElEmpty
        v-else
        class="flex-1"
        :description="$t('app.plugin.tenant_auth.empty_tenants')"
      />
    </div>
  </Page>
</template>

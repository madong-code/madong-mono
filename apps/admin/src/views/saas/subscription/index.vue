<template>
  <Page auto-content-height>
    <BasicCrud />

    <!-- 关联租户 -->
    <ElDrawer v-model="bindTenantVisible" title="关联租户" size="600px" :close-on-click-modal="false">
      <template #header>
        <span class="text-base font-bold">关联租户</span>
        <span class="ml-2 text-sm text-gray-400">套餐：{{ bindTenantRow?.name }}</span>
      </template>
      <ElTable
        ref="bindTenantTableRef"
        :data="tenantList"
        row-key="id"
        height="calc(100vh - 220px)"
        @selection-change="onTenantSelectionChange"
      >
        <ElTableColumn type="selection" width="50" />
        <ElTableColumn prop="name" label="租户名称" min-width="200" />
        <ElTableColumn prop="code" label="编码" width="150" />
      </ElTable>
      <template #footer>
        <ElButton @click="bindTenantVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="bindTenantLoading" @click="handleBindTenant">
          确定（已选 {{ selectedTenantIds.length }} 个租户）
        </ElButton>
      </template>
    </ElDrawer>

    <!-- 权限授权 -->
    <ElDrawer v-model="permVisible" title="权限授权" size="800px" :close-on-click-modal="false">
      <template #header>
        <span class="text-base font-bold">权限授权</span>
        <span class="ml-2 text-sm text-gray-400">套餐：{{ permRow?.name }}</span>
      </template>
      <PermTable ref="permTableRef" :data="permData" :checked-keys="checkedPermKeys" />
      <template #footer>
        <ElButton @click="permVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="permLoading" @click="handlePermSubmit">
          确定
        </ElButton>
      </template>
    </ElDrawer>
  </Page>
</template>

<script setup lang="ts">
import { nextTick, ref, shallowRef, watch } from 'vue';
import { ElButton, ElDrawer, ElMessage, ElTable, ElTableColumn } from 'element-plus';
import type { ElTable as ElTableType } from 'element-plus';

import { SubscriptionService } from '#/api/saas/subscription';
import { TenantService } from '#/api/saas/tenant';
import { useCrud } from '#/adapter/crud';
import { useCrudSchema } from './schemas';
import PermTable from './components/perm-table.vue';

// ===== 关联租户 =====
const bindTenantVisible = ref(false);
const bindTenantRow = ref<any>(null);
const bindTenantLoading = ref(false);
const bindTenantTableRef = ref<InstanceType<typeof ElTableType>>();
const tenantList = ref<any[]>([]);
const selectedTenantIds = ref<number[]>([]);

const onTenantSelectionChange = (rows: any[]) => {
  selectedTenantIds.value = rows.map((r) => Number(r.id));
};

const loadTenantData = async (planId: string) => {
  try {
    const [tenantRes, subRes] = await Promise.all([
      TenantService.list({ format: 'select', limit: 9999 }),
      SubscriptionService.get(planId),
    ]);
    tenantList.value = tenantRes?.data?.list || tenantRes?.data || [];
    const associatedIds: number[] = subRes?.data?.tenant_ids || [];
    selectedTenantIds.value = [...associatedIds];
    await nextTick();
    tenantList.value.forEach((row) => {
      if (associatedIds.includes(Number(row.id))) {
        bindTenantTableRef.value?.toggleRowSelection(row, true);
      }
    });
  } catch {
    tenantList.value = [];
  }
};

watch(bindTenantVisible, (v) => {
  if (v && bindTenantRow.value?.id) {
    selectedTenantIds.value = [];
    loadTenantData(bindTenantRow.value.id);
  }
});

const handleBindTenant = async () => {
  bindTenantLoading.value = true;
  try {
    await SubscriptionService.bindTenant(bindTenantRow.value.id, selectedTenantIds.value);
    ElMessage.success('关联租户成功');
    bindTenantVisible.value = false;
    crudApi.query();
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败');
  } finally {
    bindTenantLoading.value = false;
  }
};

// ===== 权限授权 =====
const permVisible = ref(false);
const permRow = ref<any>(null);
const permLoading = ref(false);
const permTableRef = ref<any>(null);

const permData = [
  {
    key: 'user', label: '用户管理', type: 'dir',
    children: [
      { key: 'user.list', label: '用户列表', type: 'menu',
        apis: [
          { key: 'api:user.list:GET',    label: '查询', method: 'GET',    path: 'user.list' },
          { key: 'api:user.list:POST',   label: '创建', method: 'POST',   path: 'user.list' },
          { key: 'api:user.list:PUT',    label: '更新', method: 'PUT',    path: 'user.list' },
          { key: 'api:user.list:DELETE', label: '删除', method: 'DELETE', path: 'user.list' },
        ],
        btns: [
          { key: 'btn:user.list:view', label: '查看' },
          { key: 'btn:user.list:edit', label: '编辑' },
          { key: 'btn:user.list:del',  label: '删除' },
        ],
      },
      { key: 'user.role', label: '角色管理', type: 'menu',
        apis: [
          { key: 'api:user.role.list:GET',  label: '查询', method: 'GET',  path: 'user.role.list' },
          { key: 'api:user.role.create:POST', label: '创建', method: 'POST', path: 'user.role.create' },
        ],
        btns: [
          { key: 'btn:user.role:view', label: '查看' },
          { key: 'btn:user.role:edit', label: '编辑' },
        ],
      },
    ],
  },
  {
    key: 'db', label: '数据源管理', type: 'dir',
    children: [
      { key: 'db.setting', label: '数据源配置', type: 'menu',
        apis: [
          { key: 'api:db.setting.list:GET',   label: '查询', method: 'GET',  path: 'db.setting.list' },
          { key: 'api:db.setting.create:POST', label: '创建', method: 'POST', path: 'db.setting.create' },
        ],
        btns: [
          { key: 'btn:db.setting:view', label: '详情' },
          { key: 'btn:db.setting:edit', label: '编辑' },
        ],
      },
      { key: 'db.backup', label: '数据备份', type: 'menu',
        apis: [
          { key: 'api:db.backup.create:POST', label: '备份', method: 'POST', path: 'db.backup.create' },
        ],
        btns: [
          { key: 'btn:db.backup:restore', label: '还原' },
        ],
      },
    ],
  },
  {
    key: 'file', label: '文件管理', type: 'dir',
    children: [
      { key: 'file.upload', label: '文件上传', type: 'menu',
        apis: [
          { key: 'api:file.upload:POST', label: '上传', method: 'POST', path: 'file.upload' },
        ],
        btns: [
          { key: 'btn:file.upload:batch', label: '批量' },
        ],
      },
      { key: 'file.list', label: '文件管理', type: 'menu',
        apis: [
          { key: 'api:file.list:GET',    label: '查询', method: 'GET',    path: 'file.list' },
          { key: 'api:file.delete:DELETE', label: '删除', method: 'DELETE', path: 'file.delete' },
        ],
        btns: [
          { key: 'btn:file.list:view',  label: '查看' },
          { key: 'btn:file.list:del',   label: '删除' },
        ],
      },
    ],
  },
  {
    key: 'log', label: '日志', type: 'dir',
    children: [
      { key: 'log.operate', label: '操作日志', type: 'menu',
        apis: [
          { key: 'api:log.operate:GET', label: '查询', method: 'GET', path: 'log.operate' },
        ],
        btns: [
          { key: 'btn:log.operate:export', label: '导出' },
        ],
      },
      { key: 'log.login', label: '登录日志', type: 'menu',
        apis: [
          { key: 'api:log.login:GET', label: '查询', method: 'GET', path: 'log.login' },
        ],
      },
    ],
  },
  {
    key: 'system', label: '系统设置', type: 'dir',
    children: [
      { key: 'system.config', label: '系统配置', type: 'menu',
        apis: [
          { key: 'api:system.config:GET', label: '查询', method: 'GET', path: 'system.config' },
          { key: 'api:system.config:PUT', label: '更新', method: 'PUT', path: 'system.config' },
        ],
        btns: [
          { key: 'btn:system.config:save', label: '保存' },
        ],
      },
      { key: 'system.menu', label: '菜单管理', type: 'menu',
        apis: [
          { key: 'api:system.menu:GET', label: '查询', method: 'GET', path: 'system.menu' },
        ],
        btns: [
          { key: 'btn:system.menu:add',  label: '新增' },
          { key: 'btn:system.menu:edit', label: '编辑' },
        ],
      },
    ],
  },
];

const checkedPermKeys = ref<string[]>([]);

watch(permVisible, async (v) => {
  if (v && permRow.value?.id) {
    const modules: string[] = permRow.value?.modules || [];
    checkedPermKeys.value = [...modules];
    await nextTick();
    permTableRef.value?.setCheckedKeys(modules);
  }
});

const handlePermSubmit = async () => {
  const keys = permTableRef.value?.getCheckedKeys() as string[] || [];
  permLoading.value = true;
  try {
    await SubscriptionService.authorize(permRow.value.id, { modules: keys, allowed_fields: [] });
    ElMessage.success('授权成功');
    permVisible.value = false;
    crudApi.query();
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败');
  } finally {
    permLoading.value = false;
  }
};

// ===== CRUD =====
const [BasicCrud, crudApi] = useCrud(useCrudSchema({
  bindTenantVisible, bindTenantRow,
  permVisible, permRow,
}));
</script>

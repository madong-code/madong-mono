<template>
  <Page auto-content-height>
    <BasicCrud />

    <!-- 表单3：关联租户（关联关系表，复选框表格批量选择） -->
    <ElDrawer v-model="bindTenantVisible" title="关联租户" size="600px" :close-on-click-modal="false">
      <div class="mb-4 text-gray-500">
        套餐：<span class="font-bold text-black">{{ bindTenantRow?.name }}</span>
      </div>
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

    <!-- 表单2：授权（树表） -->
    <ElDrawer v-model="authorizeVisible" title="授权" size="500px" :close-on-click-modal="false">
      <div class="mb-4 text-gray-500">
        套餐：<span class="font-bold text-black">{{ authorizeRow?.name }}</span>
      </div>
      <ElTree
        ref="authorizeTreeRef"
        :data="moduleTree"
        show-checkbox
        node-key="key"
        default-expand-all
        :props="{ label: 'label', children: 'children' }"
      />
      <template #footer>
        <ElButton @click="authorizeVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="authorizeLoading" @click="handleAuthorize">
          确定（已选 {{ checkedModuleKeys.length }} 个模块）
        </ElButton>
      </template>
    </ElDrawer>
  </Page>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import {
  ElButton,
  ElDrawer,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTree,
} from 'element-plus';
import type { ElTree as ElTreeType } from 'element-plus';

import { SubscriptionService } from '#/api/saas/subscription';
import { TenantService } from '#/api/saas/tenant';
import { useCrud } from '#/adapter/crud';
import { useCrudSchema } from './schemas';

// ===== 关联租户（复选框表格） =====
const bindTenantVisible = ref(false);
const bindTenantRow = ref<any>(null);
const bindTenantLoading = ref(false);
const bindTenantTableRef = ref<any>(null);
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
    // 预选已关联的租户
    const table = bindTenantTableRef.value;
    if (table) {
      tenantList.value.forEach((row) => {
        if (associatedIds.includes(Number(row.id))) {
          table.toggleRowSelection(row, true);
        }
      });
    }
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

// ===== 授权（树表） =====
const authorizeVisible = ref(false);
const authorizeRow = ref<any>(null);
const authorizeLoading = ref(false);
const authorizeTreeRef = ref<InstanceType<typeof ElTreeType>>();
const checkedModuleKeys = ref<string[]>([]);

// 模块树数据
const moduleTree = [
  {
    key: 'user',
    label: '用户管理',
    children: [
      { key: 'user.list', label: '用户列表' },
      { key: 'user.role', label: '角色管理' },
      { key: 'user.permission', label: '权限配置' },
    ],
  },
  {
    key: 'db',
    label: '数据库',
    children: [
      { key: 'db.setting', label: '数据源配置' },
      { key: 'db.backup', label: '数据备份' },
    ],
  },
  {
    key: 'file',
    label: '文件管理',
    children: [
      { key: 'file.upload', label: '文件上传' },
      { key: 'file.manager', label: '文件管理' },
    ],
  },
  {
    key: 'log',
    label: '日志',
    children: [
      { key: 'log.operate', label: '操作日志' },
      { key: 'log.login', label: '登录日志' },
    ],
  },
  {
    key: 'api',
    label: 'API',
    children: [
      { key: 'api.doc', label: '接口文档' },
      { key: 'api.limit', label: '频率限制' },
    ],
  },
  {
    key: 'system',
    label: '系统设置',
    children: [
      { key: 'system.config', label: '系统配置' },
      { key: 'system.menu', label: '菜单管理' },
    ],
  },
];

watch(authorizeVisible, async (v) => {
  if (v && authorizeRow.value?.id) {
    const currentModules: string[] = authorizeRow.value?.modules || [];
    checkedModuleKeys.value = [...currentModules];
    await nextTick();
    authorizeTreeRef.value?.setCheckedKeys(currentModules);
  }
});

const handleAuthorize = async () => {
  const keys = authorizeTreeRef.value?.getCheckedKeys() as string[] || [];
  authorizeLoading.value = true;
  try {
    await SubscriptionService.authorize(authorizeRow.value.id, {
      modules: keys,
      allowed_fields: [],
    });
    ElMessage.success('授权成功');
    authorizeVisible.value = false;
    crudApi.query();
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败');
  } finally {
    authorizeLoading.value = false;
  }
};

const [BasicCrud, crudApi] = useCrud(useCrudSchema({
  bindTenantVisible,
  bindTenantRow,
  authorizeVisible,
  authorizeRow,
}));
</script>

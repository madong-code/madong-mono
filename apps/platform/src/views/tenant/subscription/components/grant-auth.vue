<script setup lang="ts">
import type { ElTree as ElTreeType } from 'element-plus';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElTree,
} from 'element-plus';

import { SubscriptionService } from '#/api/tenant/subscription';
import { Icon } from '#/components/icon';
import { $t } from '#/locales';

interface TreeNode {
  key: string;
  label: string;
  type: 1 | 2 | 3 | 4;
  children?: TreeNode[];
  method?: string;
  path?: string;
}

interface RawNode {
  key: string;
  label: string;
  type: 1 | 2 | 3 | 4;
  children?: RawNode[];
  method?: string;
  path?: string;
}

const typeLabels: Record<number, string> = {
  1: $t('tenant.subscription.drawer.grant_auth.type_labels.dir'),
  2: $t('tenant.subscription.drawer.grant_auth.type_labels.menu'),
  3: $t('tenant.subscription.drawer.grant_auth.type_labels.perm'),
  4: $t('tenant.subscription.drawer.grant_auth.type_labels.api'),
};

let authData: RawNode[] = [];

const treeRef = ref<InstanceType<typeof ElTreeType>>();
const treeData = ref<TreeNode[]>([]);
const currentRow = ref<any>(null);
const onSuccessRef = ref<(() => void) | null>(null);

/**
 * 请求计数器，防止快速开关抽屉时旧响应覆盖新数据
 */
let loadId = 0;

// ===== 构建树数据（包含所有类型节点）=====
const buildTreeData = (nodes: RawNode[]): TreeNode[] => {
  return nodes.map((node) => {
    const converted: TreeNode = { ...node };
    if (node.children) {
      converted.children = buildTreeData(node.children);
    }
    return converted;
  });
};

// ===== 从 API 获取权限树（仅首次加载）=====
const treeLoaded = ref(false);
const initPermissionTree = async () => {
  if (treeLoaded.value) return;
  treeLoaded.value = true;
  try {
    const res = await SubscriptionService.getPermissionTree();
    authData = (res || []) as RawNode[];
  } catch {
    treeLoaded.value = false;
    authData = [];
  }
  treeData.value = buildTreeData(authData);
};

// ===== 选中状态管理 =====
const setCheckedKeys = (keys: string[]) => {
  const tree = treeRef.value;
  if (!tree) return;
  tree.setCheckedKeys([]);
  nextTick(() => {
    keys.forEach((k) => tree.setChecked(k, true, false));
  });
};

const getCheckedKeys = (): string[] => {
  return (treeRef.value?.getCheckedKeys(true) as string[]) || [];
};

/**
 * 从 show 接口获取已授权的权限 key 列表并回显
 */
const loadData = async (planId: string) => {
  const id = ++loadId;
  try {
    const res = await SubscriptionService.get(planId);
    if (id !== loadId) return;
    const permIds: string[] = (res?.permission_ids || []).map(String);
    setCheckedKeys(permIds);
  } catch {
    if (id !== loadId) return;
    setCheckedKeys([]);
  }
};

// ===== Vben Drawer =====
const [Drawer, drawerApi] = useVbenDrawer({
  title: $t('tenant.subscription.drawer.grant_auth.title'),
  class: 'w-[800px]',
  closeOnClickModal: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ onSuccess?: () => void; row: any }>();
      currentRow.value = data?.row;
      onSuccessRef.value = data?.onSuccess || null;
      // 重置选中状态，避免显示上一个套餐的旧数据
      setCheckedKeys([]);
      // 先确保权限树加载完成，再回显已授权数据
      initPermissionTree().then(() => {
        if (currentRow.value?.id) loadData(currentRow.value.id);
      });
    }
  },
  async onConfirm() {
    const keys = getCheckedKeys();
    drawerApi.setState({ confirmLoading: true });
    try {
      const res = await SubscriptionService.authorize(
        currentRow.value.id,
        keys,
      );
      ElMessage.success($t('tenant.subscription.drawer.grant_auth.success'));
      // 用后端返回的 ids 回显
      if (res?.ids) {
        setCheckedKeys(res.ids);
      }
      onSuccessRef.value?.();
      drawerApi.close();
    } catch (error: any) {
      ElMessage.error(
        error?.message || $t('tenant.subscription.drawer.grant_auth.failed'),
      );
    } finally {
      drawerApi.setState({ confirmLoading: false });
    }
  },
  onCancel() {
    drawerApi.close();
  },
});

const handleToolCommand = (command: string) => {
  const expandNode = (key: string) => {
    const n = treeRef.value?.getNode(key);
    if (n) n.expanded = true;
  };
  const collapseNode = (key: string) => {
    const n = treeRef.value?.getNode(key);
    if (n) n.expanded = false;
  };
  const traverse = (nodes: TreeNode[], fn: (n: TreeNode) => void) => {
    nodes.forEach((n) => {
      fn(n);
      if (n.children) traverse(n.children, fn);
    });
  };
  switch (command) {
    case 'collapse-all': {
      traverse(treeData.value, (n) => collapseNode(n.key));
      break;
    }
    case 'expand-all': {
      traverse(treeData.value, (n) => expandNode(n.key));
      break;
    }
    case 'expand-level-1': {
      expandToLevel(1);
      break;
    }
    case 'expand-level-2': {
      expandToLevel(2);
      break;
    }
    case 'select-all': {
      selectAll();
      break;
    }
    case 'select-inverse': {
      selectInverse();
      break;
    }
    case 'select-none': {
      selectNone();
      break;
    }
  }
};

const expandToLevel = (level: number) => {
  const expandNode = (key: string) => {
    const n = treeRef.value?.getNode(key);
    if (n) n.expanded = true;
  };
  const collapseNode = (key: string) => {
    const n = treeRef.value?.getNode(key);
    if (n) n.expanded = false;
  };
  const traverse = (nodes: TreeNode[], fn: (n: TreeNode) => void) => {
    nodes.forEach((n) => {
      fn(n);
      if (n.children) traverse(n.children, fn);
    });
  };
  traverse(treeData.value, (n) => collapseNode(n.key));
  const expandNodeByLevel = (nodes: TreeNode[], currentLevel: number) => {
    nodes.forEach((node) => {
      if (currentLevel <= level) {
        expandNode(node.key);
      }
      if (node.children && currentLevel < level) {
        expandNodeByLevel(node.children, currentLevel + 1);
      }
    });
  };
  expandNodeByLevel(treeData.value, 1);
};

const selectAll = () => {
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      treeRef.value?.setChecked(n.key, true);
      if (n.children) traverse(n.children);
    });
  };
  traverse(treeData.value);
};

const selectNone = () => {
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      treeRef.value?.setChecked(n.key, false);
      if (n.children) traverse(n.children);
    });
  };
  traverse(treeData.value);
};

const selectInverse = () => {
  const leafKeys: string[] = [];
  const collectLeaves = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      if (!n.children || n.children.length === 0) {
        leafKeys.push(n.key);
      } else {
        collectLeaves(n.children);
      }
    });
  };
  collectLeaves(treeData.value);

  const checkedKeys = treeRef.value?.getCheckedKeys(true) || [];
  const toCheck = leafKeys.filter((k) => !checkedKeys.includes(k));

  treeRef.value?.setCheckedKeys([]);
  nextTick(() => {
    toCheck.forEach((k) => treeRef.value?.setChecked(k, true));
  });
};
</script>

<template>
  <Drawer>
    <div class="auth-tree">
      <ElTree
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="key"
        :props="{ label: 'label', children: 'children' }"
      >
        <template #default="{ data }">
          <span class="gt-row">
            <span class="gt-tag" :class="`gt-tag--${data.type}`">
              {{ typeLabels[data.type] }}
            </span>
            <span
              v-if="data.type === 4"
              class="gt-method"
              :class="`gt-method--${(data.method || '').toLowerCase()}`"
            >
              {{ data.method }}
            </span>
            <span class="gt-name">{{
              data.type === 4 ? data.path : data.label
            }}</span>
          </span>
        </template>
      </ElTree>
    </div>
    <template #prepend-footer>
      <div class="footer-tools">
        <ElDropdown @command="handleToolCommand">
          <ElButton size="small" type="text">
            <span>{{
              $t('tenant.subscription.drawer.grant_auth.action')
            }}</span>
            <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-1" />
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="expand-all">
{{
                $t('tenant.subscription.drawer.grant_auth.expand_all')
              }}
</ElDropdownItem>
              <ElDropdownItem command="collapse-all">
{{
                $t('tenant.subscription.drawer.grant_auth.collapse_all')
              }}
</ElDropdownItem>
              <ElDropdownItem command="expand-level-1">
{{
                $t('tenant.subscription.drawer.grant_auth.expand_level_1')
              }}
</ElDropdownItem>
              <ElDropdownItem command="expand-level-2">
{{
                $t('tenant.subscription.drawer.grant_auth.expand_level_2')
              }}
</ElDropdownItem>
              <ElDropdownItem divided command="select-all">
{{
                $t('tenant.subscription.drawer.grant_auth.select_all')
              }}
</ElDropdownItem>
              <ElDropdownItem command="select-none">
{{
                $t('tenant.subscription.drawer.grant_auth.select_none')
              }}
</ElDropdownItem>
              <ElDropdownItem command="select-inverse">
{{
                $t('tenant.subscription.drawer.grant_auth.select_inverse')
              }}
</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.auth-tree {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
}

.auth-tree :deep(.el-tree-node__content) {
  min-height: 32px;
  padding: 4px 0 !important;
}

.auth-tree :deep(.el-tree-node__children) {
  padding-left: 20px !important;
}

.auth-tree :deep(.el-tree-node.is-leaf > .el-tree-node__expand-icon) {
  visibility: hidden;
}

.gt-row {
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
}

.gt-tag {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 18px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  border-radius: 3px;
}

.gt-tag--1 {
  background: #4080ff;
}

.gt-tag--2 {
  background: #00b42a;
}

.gt-tag--3 {
  background: #e6a23c;
}

.gt-tag--4 {
  background: #722ed1;
}

.gt-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.gt-method {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 16px;
  padding: 0 5px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  border-radius: 2px;
}

.gt-method--get {
  background: #00b42a;
}

.gt-method--post {
  background: #165dff;
}

.gt-method--put {
  background: #e6a23c;
}

.gt-method--delete {
  background: #f56c6c;
}

.footer-tools {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.footer-tools :deep(.el-button) {
  padding: 8px 12px;
  font-size: 14px;
}

.footer-tools :deep(.el-dropdown-menu) {
  text-align: left;
}

.footer-tools :deep(.el-dropdown-item) {
  justify-content: flex-start;
  text-align: left;
}
</style>

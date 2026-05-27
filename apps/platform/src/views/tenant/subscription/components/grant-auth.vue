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
      <span class="gt-tag" :class="'gt-tag--' + data.type">
        {{ typeLabels[data.type] }}
      </span>
      <span v-if="data.type === 4" class="gt-method" :class="'gt-method--' + (data.method||'').toLowerCase()">
        {{ data.method }}
      </span>
      <span class="gt-name">{{ data.type === 4 ? data.path : data.label }}</span>
    </span>
  </template>
</ElTree>
    </div>
    <template #prepend-footer>
      <div class="footer-tools">
        <ElDropdown @command="handleToolCommand">
          <ElButton size="small" type="text">
            <span>操作</span>
            <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-1" />
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="expand-all">展开全部</ElDropdownItem>
              <ElDropdownItem command="collapse-all">收缩全部</ElDropdownItem>
              <ElDropdownItem command="expand-level-1">展开一级</ElDropdownItem>
              <ElDropdownItem command="expand-level-2">展开二级</ElDropdownItem>
              <ElDropdownItem divided command="select-all">全选</ElDropdownItem>
              <ElDropdownItem command="select-none">取消全选</ElDropdownItem>
              <ElDropdownItem command="select-inverse">反选</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, ElTree } from 'element-plus';
import type { ElTree as ElTreeType } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';
import { Icon } from '#/components/icon';

import { SubscriptionService } from '#/api/tenant/subscription';

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

const typeLabels: Record<number, string> = { 1: '目录', 2: '菜单', 3: '权限', 4: 'Api' };

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
  } catch (e: any) {
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
  title: '权限授权',
  class: 'w-[800px]',
  closeOnClickModal: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ row: any; onSuccess?: () => void }>();
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
      const res = await SubscriptionService.authorize(currentRow.value.id, keys);
      ElMessage.success('授权成功');
      // 用后端返回的 ids 回显
      if (res?.ids) {
        setCheckedKeys(res.ids);
      }
      onSuccessRef.value?.();
      drawerApi.close();
    } catch (e: any) {
      ElMessage.error(e?.message || '操作失败');
    } finally {
      drawerApi.setState({ confirmLoading: false });
    }
  },
  onCancel() {
    drawerApi.close();
  },
});

const handleToolCommand = (command: string) => {
  const expandNode = (key: string) => { const n = treeRef.value?.getNode(key); if (n) n.expanded = true; };
  const collapseNode = (key: string) => { const n = treeRef.value?.getNode(key); if (n) n.expanded = false; };
  const traverse = (nodes: TreeNode[], fn: (n: TreeNode) => void) => {
    nodes.forEach((n) => {
      fn(n);
      if (n.children) traverse(n.children, fn);
    });
  };
  switch (command) {
    case 'expand-all':
      traverse(treeData.value, (n) => expandNode(n.key));
      break;
    case 'collapse-all':
      traverse(treeData.value, (n) => collapseNode(n.key));
      break;
    case 'expand-level-1':
      expandToLevel(1);
      break;
    case 'expand-level-2':
      expandToLevel(2);
      break;
    case 'select-all':
      selectAll();
      break;
    case 'select-none':
      selectNone();
      break;
    case 'select-inverse':
      selectInverse();
      break;
  }
};

const expandToLevel = (level: number) => {
  const expandNode = (key: string) => { const n = treeRef.value?.getNode(key); if (n) n.expanded = true; };
  const collapseNode = (key: string) => { const n = treeRef.value?.getNode(key); if (n) n.expanded = false; };
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

<style scoped>
.auth-tree {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 0;
}

.auth-tree :deep(.el-tree-node__content) {
  padding: 4px 0 !important;
  min-height: 32px;
}

.auth-tree :deep(.el-tree-node__children) {
  padding-left: 20px !important;
}

.auth-tree :deep(.el-tree-node.is-leaf > .el-tree-node__expand-icon) {
  visibility: hidden;
}

.gt-row {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.gt-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  height: 18px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  color: #fff;
  min-width: 32px;
}

.gt-tag--1 { background: #4080ff; }
.gt-tag--2 { background: #00b42a; }
.gt-tag--3 { background: #e6a23c; }
.gt-tag--4 { background: #722ed1; }

.gt-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.gt-method {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  height: 16px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 10px;
  font-weight: 700;
  border-radius: 2px;
  color: #fff;
  min-width: 36px;
}

.gt-method--get { background: #00b42a; }
.gt-method--post { background: #165DFF; }
.gt-method--put { background: #e6a23c; }
.gt-method--delete { background: #f56c6c; }

.footer-tools {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.footer-tools :deep(.el-button) {
  font-size: 14px;
  padding: 8px 12px;
}

.footer-tools :deep(.el-dropdown-menu) {
  text-align: left;
}

.footer-tools :deep(.el-dropdown-item) {
  text-align: left;
  justify-content: flex-start;
}
</style>

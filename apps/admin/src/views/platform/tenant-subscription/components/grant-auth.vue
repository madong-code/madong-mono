<template>
  <Drawer>
    <template #extra>
      <span class="text-sm text-gray-400">套餐：{{ currentRow?.name }}</span>
    </template>
    <div class="auth-tree">
      <ElTree
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="key"
        default-expand-all
        :check-strictly="true"
        :props="{ label: 'label', children: 'children' }"
        @check="onCheck"
      >
        <template #default="{ data }">
          <!-- 目录节点 -->
          <template v-if="data.type === 1">
            <span class="node-dir">{{ data.label }}</span>
          </template>

          <!-- 菜单节点 -->
          <template v-else-if="data.type === 2">
            <div class="perm-divider"></div>
            <div class="node-menu">
              <span class="menu-title">{{ data.label }}</span>
            </div>
            <div v-if="menuDataMap[data.key]?.children?.length" class="perm-group" @click.stop>
              <!-- 接口行 -->
              <div v-if="hasApiChildren(menuDataMap[data.key])" class="perm-row">
                <div class="perm-row-items">
                  <label
                    v-for="child in menuDataMap[data.key].children"
                    :key="child.key"
                    v-show="child.type === 4"
                    class="perm-tag"
                    :class="[`tag-${child.method}`, cardState[child.key] && 'tag-checked']"
                    @mousedown.prevent
                    @mouseup.prevent="toggleCard(child.key, menuDataMap[data.key])"
                  >
                    <span class="tag-checkbox" :class="cardState[child.key] && 'cb-checked'">
                      <span v-if="cardState[child.key]" class="cb-icon">✓</span>
                    </span>
                    <span class="tag-method">{{ child.method }}</span>
                    <span class="tag-path">{{ child.path }}</span>
                  </label>
                </div>
              </div>
              <!-- 按钮行 -->
              <div v-if="hasBtnChildren(menuDataMap[data.key])" class="perm-row">
                <div class="perm-row-items">
                  <label
                    v-for="child in menuDataMap[data.key].children"
                    :key="child.key"
                    v-show="child.type === 3"
                    class="perm-tag tag-btn"
                    :class="cardState[child.key] && 'tag-checked'"
                    @mousedown.prevent
                    @mouseup.prevent="toggleCard(child.key, menuDataMap[data.key])"
                  >
                    <span class="tag-checkbox" :class="cardState[child.key] && 'cb-checked'">
                      <span v-if="cardState[child.key]" class="cb-icon">✓</span>
                    </span>
                    <span>{{ child.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </template>
      </ElTree>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { ElMessage, ElTree } from 'element-plus';
import type { ElTree as ElTreeType } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';

import { SubscriptionService } from '#/api/platform/tenant-subscription';

interface TreeNode {
  key: string;
  label: string;
  type: 1 | 2;
  children?: TreeNode[];
}

interface MenuNode {
  key: string;
  label: string;
  type: 2;
  children?: PermissionNode[];
}

interface PermissionNode {
  key: string;
  label: string;
  type: 3 | 4;
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

let authData: RawNode[] = [];

const treeRef = ref<InstanceType<typeof ElTreeType>>();
const treeData = ref<TreeNode[]>([]);
const cardState = reactive<Record<string, boolean>>({});
const menuDataMap = reactive<Record<string, MenuNode>>({});
const currentRow = ref<any>(null);
const onSuccessRef = ref<(() => void) | null>(null);

/**
 * 请求计数器，防止快速开关抽屉时旧响应覆盖新数据
 */
let loadId = 0;

// ===== 构建树数据（一次性）=====
const buildTreeData = (nodes: RawNode[]): TreeNode[] => {
  return nodes
    .filter((node) => node.type === 1 || node.type === 2)
    .map((node) => {
      const converted: TreeNode = { ...node };
      if (node.children) {
        converted.children = buildTreeData(node.children);
      }
      return converted;
    });
};

const buildMenuDataMap = (nodes: RawNode[]) => {
  nodes.forEach((node) => {
    if (node.type === 2) {
      const converted: MenuNode = { ...node, type: 2 };
      if (node.children) {
        converted.children = node.children
          .filter((child) => child.type === 3 || child.type === 4)
          .map((child) => ({ ...child }));
      }
      menuDataMap[converted.key] = converted;
    }
    if (node.children) {
      buildMenuDataMap(node.children);
    }
  });
};

// ===== 初始化：从 API 获取权限树 =====
const initPermissionTree = async () => {
  try {
    const res = await SubscriptionService.getPermissionTree();
    authData = (res || []) as RawNode[];
  } catch {
    authData = [];
  }
  treeData.value = buildTreeData(authData);
  buildMenuDataMap(authData);
};

initPermissionTree();

// ===== 工具函数 =====
const hasApiChildren = (menu: MenuNode): boolean =>
  (menu.children || []).some((c) => c.type === 4);

const hasBtnChildren = (menu: MenuNode): boolean =>
  (menu.children || []).some((c) => c.type === 3);

const getAllCardKeysOfMenu = (menu: MenuNode): string[] => {
  const keys: string[] = [];
  (menu.children || []).forEach((child) => {
    if (child.type === 3 || child.type === 4) keys.push(child.key);
  });
  return keys;
};

const isAllCardsChecked = (menu: MenuNode): boolean => {
  const keys = getAllCardKeysOfMenu(menu);
  return keys.length > 0 && keys.every((k) => cardState[k]);
};

const isSomeCardsChecked = (menu: MenuNode): boolean => {
  const keys = getAllCardKeysOfMenu(menu);
  return keys.some((k) => cardState[k]);
};

// ===== 卡片切换 =====
const toggleCard = (key: string, menu: MenuNode) => {
  const newState = !cardState[key];
  cardState[key] = newState;
  updateMenuCheckState(menu);
  updateDirCheckState(menu);
};

const updateMenuCheckState = (menu: MenuNode) => {
  if (isAllCardsChecked(menu)) {
    treeRef.value?.setChecked(menu.key, true, false);
  } else if (!isSomeCardsChecked(menu)) {
    treeRef.value?.setChecked(menu.key, false, false);
  }
};

const updateDirCheckState = (menu: MenuNode) => {
  const node = treeRef.value?.getNode(menu.key);
  const parent = node?.parent;
  if (parent && parent.data?.type === 1) {
    const dirData = parent.data as TreeNode;
    const allChildren = dirData.children || [];
    const allChecked = allChildren.every((m) => {
      const menuData = menuDataMap[m.key];
      return menuData ? isAllCardsChecked(menuData) : false;
    });
    const someChecked = allChildren.some((m) => {
      const menuData = menuDataMap[m.key];
      return menuData ? isSomeCardsChecked(menuData) : false;
    });
    if (allChecked) {
      treeRef.value?.setChecked(dirData.key, true, false);
    } else if (!someChecked) {
      treeRef.value?.setChecked(dirData.key, false, false);
    }
  }
};

// ===== 树勾选联动卡片 =====
const onCheck = (_nodeData: any, checkState: any) => {
  const node = treeRef.value?.getNode(_nodeData.key);
  const data = node?.data as TreeNode | undefined;
  if (!data) return;
  const checkedKeys: string[] = checkState.checkedKeys || [];
  const isChecked = checkedKeys.includes(data.key);

  if (data.type === 2) {
    const menuData = menuDataMap[data.key];
    if (menuData) {
      setAllCards(menuData, isChecked);
      updateDirCheckState(menuData);
    }
  }
  if (data.type === 1) syncDirChildren(data, isChecked);
};

const syncDirChildren = (dir: TreeNode, isChecked: boolean) => {
  (dir.children || []).forEach((m) => {
    if (m.type === 2) {
      treeRef.value?.setChecked(m.key, isChecked, false);
      const menuData = menuDataMap[m.key];
      if (menuData) setAllCards(menuData, isChecked);
    } else if (m.type === 1) {
      treeRef.value?.setChecked(m.key, isChecked, false);
      syncDirChildren(m, isChecked);
    }
  });
};

const setAllCards = (menu: MenuNode, checked: boolean) => {
  getAllCardKeysOfMenu(menu).forEach((k) => { cardState[k] = checked; });
};

// ===== 选中状态管理 =====
const setCheckedKeys = (keys: string[]) => {
  Object.keys(cardState).forEach((k) => delete cardState[k]);
  treeRef.value?.setCheckedKeys([]);

  Object.values(menuDataMap).forEach((menu) => {
    getAllCardKeysOfMenu(menu).forEach((k) => {
      cardState[k] = keys.includes(k);
    });
  });

  const syncTree = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      if (n.type === 2) {
        const menuData = menuDataMap[n.key];
        if (menuData) {
          const checked = isAllCardsChecked(menuData) || isSomeCardsChecked(menuData);
          treeRef.value?.setChecked(n.key, checked, false);
        }
      }
      if (n.type === 1) {
        const allChecked = (n.children || []).every((m) => {
          const menuData = menuDataMap[m.key];
          return menuData ? isAllCardsChecked(menuData) : false;
        });
        const someChecked = (n.children || []).some((m) => {
          const menuData = menuDataMap[m.key];
          return menuData ? isSomeCardsChecked(menuData) : false;
        });
        treeRef.value?.setChecked(n.key, allChecked || someChecked, false);
      }
      if (n.children) syncTree(n.children);
    });
  };
  nextTick(() => syncTree(treeData.value));
};

const getCheckedKeys = (): string[] => {
  const keys: string[] = [];
  Object.entries(cardState).forEach(([k, v]) => { if (v) keys.push(k); });
  const treeKeys = (treeRef.value?.getCheckedKeys(true) as string[]) || [];
  treeKeys.forEach((k) => { if (!keys.includes(k)) keys.push(k); });
  return [...new Set(keys)];
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
      if (currentRow.value?.id) loadData(currentRow.value.id);
    }
  },
  async onConfirm() {
    const keys = getCheckedKeys();
    drawerApi.setState({ confirmLoading: true });
    try {
      const res = await SubscriptionService.authorize(currentRow.value.id, { permission_ids: keys });
      ElMessage.success('授权成功');
      // 用后端返回的 permission_ids 回显
      if (res?.permission_ids) {
        setCheckedKeys(res.permission_ids);
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
</script>

<style scoped>
.auth-tree {
  padding: 4px 0;
}

.auth-tree :deep(.el-tree-node__content) {
  align-items: flex-start;
  height: auto;
  min-height: 26px;
  padding: 2px 0;
}

.auth-tree :deep(.el-tree-node__label) {
  width: 100%;
  padding-right: 8px;
}

.auth-tree :deep(.el-tree-node.is-leaf > .el-tree-node__expand-icon) {
  visibility: hidden;
}

.node-dir {
  display: inline-flex;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
}

.node-menu {
  display: flex;
  align-items: center;
  margin-top: 3px;
}

.menu-title {
  font-size: 13px;
  font-weight: 500;
  color: #4e5969;
}

.perm-divider {
  height: 1px;
  margin: 8px 0 6px;
  background: #eee;
}

.perm-group {
  padding: 0 4px 4px 0;
  margin: 0;
  margin-top: 20px;
}

.perm-row {
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: flex-start;
}

.perm-row-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.perm-tag {
  box-sizing: border-box;
  display: inline-flex;
  gap: 5px;
  align-items: center;
  height: 26px;
  padding: 2px 8px 2px 5px;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: all 0.12s;
}

.perm-tag:hover {
  background: #f0f5ff;
  border-color: #b8d4ff;
}

.perm-tag.tag-checked {
  background: #f0f5ff;
  border-color: #94bfff;
}

.tag-checkbox {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 1.5px solid #d0d0d0;
  border-radius: 2px;
  transition: all 0.12s;
}

.perm-tag:hover .tag-checkbox {
  border-color: #165DFF;
}

.tag-checkbox.cb-checked {
  background: #165DFF;
  border-color: #165DFF;
}

.cb-icon {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.tag-method {
  flex-shrink: 0;
  padding: 0 3px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  border-radius: 2px;
}

.tag-GET .tag-method {
  color: #00b42a;
  background: #e8ffea;
}

.tag-POST .tag-method {
  color: #165DFF;
  background: #e8f3ff;
}

.tag-PUT .tag-method {
  color: #e6a23c;
  background: #fff7e6;
}

.tag-DELETE .tag-method {
  color: #f53f3f;
  background: #ffece8;
}

.tag-PATCH .tag-method {
  color: #722ed1;
  background: #f5e8ff;
}

.tag-path {
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 11px;
  color: #606266;
}

.tag-btn {
  color: #606266;
}

.tag-btn.tag-checked {
  background: #f0f5ff;
  border-color: #94bfff;
}
</style>

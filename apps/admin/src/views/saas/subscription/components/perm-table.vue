<template>
  <div class="perm-tree">
    <ElTree
      ref="treeRef"
      :data="treeData"
      show-checkbox
      node-key="key"
      default-expand-all
      :check-strictly="true"
      :props="{ label: 'label', children: 'children' }"
      @check="(data: any, info: any) => onCheck(data, info)"
    >
      <template #default="{ data }">
        <!-- 目录节点 -->
        <template v-if="data.type === 'dir'">
          <span class="node-dir">{{ data.label }}</span>
        </template>

        <!-- 菜单节点 -->
        <template v-else>
          <!-- 模块间分割线 -->
          <div class="perm-divider"></div>
          <div class="node-menu">
            <span class="menu-title">{{ data.label }}</span>
          </div>
          <div v-if="data.apis?.length || data.btns?.length" class="perm-group" @click.stop>
            <!-- 接口行 -->
            <div v-if="data.apis?.length" class="perm-row">
              <!-- <span class="perm-row-label">接口</span> -->
              <div class="perm-row-items">
                <label
                  v-for="api in data.apis"
                  :key="api.key"
                  class="perm-tag"
                  :class="[`tag-${api.method}`, cardState[api.key] && 'tag-checked']"
                  @mousedown.prevent="() => {}"
                  @mouseup.prevent="toggleCard(api.key, data)"
                >
                  <span class="tag-checkbox" :class="cardState[api.key] && 'cb-checked'">
                    <span v-if="cardState[api.key]" class="cb-icon">✓</span>
                  </span>
                  <span class="tag-method">{{ api.method }}</span>
                  <span class="tag-path">{{ api.path }}</span>
                </label>
              </div>
            </div>
            <!-- 按钮行 -->
            <div v-if="data.btns?.length" class="perm-row">
              <!-- <span class="perm-row-label">按钮</span> -->
              <div class="perm-row-items">
                <label
                  v-for="btn in data.btns"
                  :key="btn.key"
                  class="perm-tag tag-btn"
                  :class="cardState[btn.key] && 'tag-checked'"
                  @mousedown.prevent="() => {}"
                  @mouseup.prevent="toggleCard(btn.key, data)"
                >
                  <span class="tag-checkbox" :class="cardState[btn.key] && 'cb-checked'">
                    <span v-if="cardState[btn.key]" class="cb-icon">✓</span>
                  </span>
                  <span>{{ btn.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </template>
      </template>
    </ElTree>
  </div>
</template>

<script setup lang="ts">
import { ElTree } from 'element-plus';
import type { ElTree as ElTreeType } from 'element-plus';
import { reactive, ref } from 'vue';

export interface PermNode {
  key: string;
  label: string;
  type: 'dir' | 'menu';
  children?: PermNode[];
  apis?: { key: string; label: string; method: string; path: string }[];
  btns?: { key: string; label: string }[];
}

const props = defineProps<{
  data: PermNode[];
}>();

const treeRef = ref<InstanceType<typeof ElTreeType>>();
const treeData = ref<PermNode[]>([]);
const cardState = reactive<Record<string, boolean>>({});

const init = () => {
  treeData.value = JSON.parse(JSON.stringify(props.data));
};
init();

// ---------- 工具 ----------
const getAllCardKeysOfMenu = (menu: PermNode): string[] => {
  const keys: string[] = [];
  menu.apis?.forEach((a) => keys.push(a.key));
  menu.btns?.forEach((b) => keys.push(b.key));
  return keys;
};

const isAllCardsChecked = (menu: PermNode): boolean => {
  const keys = getAllCardKeysOfMenu(menu);
  return keys.length > 0 && keys.every((k) => cardState[k]);
};

const isSomeCardsChecked = (menu: PermNode): boolean => {
  const keys = getAllCardKeysOfMenu(menu);
  return keys.some((k) => cardState[k]);
};

// ---------- 卡片切换 ----------
const toggleCard = (key: string, menu: PermNode) => {
  const newState = !cardState[key];
  cardState[key] = newState;

  updateMenuCheckState(menu);
  updateAncestorCheckState(menu);
};

// 更新菜单节点 check 状态
const updateMenuCheckState = (menu: PermNode) => {
  if (isAllCardsChecked(menu)) {
    treeRef.value?.setChecked(menu.key, true, false);
  } else if (!isSomeCardsChecked(menu)) {
    treeRef.value?.setChecked(menu.key, false, false);
  }
};

// 更新祖先目录状态
const updateAncestorCheckState = (menu: PermNode) => {
  const node = treeRef.value?.getNode(menu.key);
  const parent = node?.parent;
  if (parent && parent.data?.type === 'dir') {
    const dirData = parent.data as PermNode;
    const allChildren = dirData.children || [];
    const allChecked = allChildren.every((m) => isAllCardsChecked(m));
    const someChecked = allChildren.some((m) => isSomeCardsChecked(m));

    if (allChecked) {
      treeRef.value?.setChecked(dirData.key, true, false);
    } else if (!someChecked) {
      treeRef.value?.setChecked(dirData.key, false, false);
    }
  }
};

// ---------- 树勾选 -> 联动卡片 ----------
const onCheck = (_nodeData: any, checkState: any) => {
  const node = treeRef.value?.getNode(_nodeData.key);
  const data = node?.data as PermNode | undefined;
  if (!data) return;

  const checkedKeys: string[] = checkState.checkedKeys || [];
  const isChecked = checkedKeys.includes(data.key);

  if (data.type === 'menu') {
    setAllCards(data, isChecked);
    if (isChecked && !isAllCardsChecked(data)) {
      setAllCards(data, true);
    }
    updateAncestorCheckState(data);
  }

  if (data.type === 'dir') {
    data.children?.forEach((m) => {
      treeRef.value?.setChecked(m.key, isChecked, false);
      setAllCards(m, isChecked);
    });
  }
};

const setAllCards = (menu: PermNode, checked: boolean) => {
  const keys = getAllCardKeysOfMenu(menu);
  keys.forEach((k) => {
    cardState[k] = checked;
  });
};

// ---------- 暴露方法 ----------
const setCheckedKeys = (keys: string[]) => {
  Object.keys(cardState).forEach((k) => delete cardState[k]);
  treeRef.value?.setCheckedKeys([]);

  const walk = (nodes: PermNode[]) => {
    nodes.forEach((n) => {
      if (n.type === 'menu') {
        const cardKeys = getAllCardKeysOfMenu(n);
        cardKeys.forEach((k) => {
          cardState[k] = keys.includes(k);
        });
      }
      if (n.children) walk(n.children);
    });
  };
  walk(treeData.value);

  treeRef.value?.setCheckedKeys(keys);

  const syncTree = (nodes: PermNode[]) => {
    nodes.forEach((n) => {
      if (n.type === 'menu') {
        if (isAllCardsChecked(n)) {
          treeRef.value?.setChecked(n.key, true, false);
        } else if (!isSomeCardsChecked(n)) {
          treeRef.value?.setChecked(n.key, false, false);
        } else {
          treeRef.value?.setChecked(n.key, true, false);
        }
      }
      if (n.type === 'dir') {
        const allChecked = (n.children || []).every((m) => isAllCardsChecked(m));
        const someChecked = (n.children || []).some((m) => isSomeCardsChecked(m));
        if (allChecked) treeRef.value?.setChecked(n.key, true, false);
        else if (someChecked) treeRef.value?.setChecked(n.key, true, false);
        else treeRef.value?.setChecked(n.key, false, false);
      }
      if (n.children) syncTree(n.children);
    });
  };
  syncTree(treeData.value);
};

const getCheckedKeys = (): string[] => {
  const keys: string[] = [];
  Object.entries(cardState).forEach(([k, v]) => {
    if (v) keys.push(k);
  });
  const treeKeys = treeRef.value?.getCheckedKeys(true) as string[] || [];
  treeKeys.forEach((k) => {
    if (!keys.includes(k)) keys.push(k);
  });
  return [...new Set(keys)];
};

defineExpose({ setCheckedKeys, getCheckedKeys });
</script>

<style scoped>
/* ===== 基础 ===== */
.perm-tree { padding: 4px 0; }
.perm-tree :deep(.el-tree-node__content) {
  height: auto; min-height: 26px; padding: 2px 0; align-items: flex-start;
}
.perm-tree :deep(.el-tree-node__label) {
  width: 100%; padding-right: 8px;
}
.perm-tree :deep(.el-tree-node.is-leaf > .el-tree-node__expand-icon) { visibility: hidden; }

/* ===== 目录 ===== */
.node-dir {
  font-weight: 600; font-size: 14px; color: #1d2129;
  display: inline-flex; align-items: center; padding: 4px 0;
}

/* ===== 菜单标题 ===== */
.node-menu {
  display: flex; align-items: center; margin-top: 3px;
}
.menu-title {
  font-weight: 500; font-size: 13px; color: #4e5969;
}

/* ===== 模块间分割线 ===== */
.perm-divider {
  height: 1px; background: #eee; margin: 8px 0 6px;
}

/* ===== 权限分组 ===== */
.perm-group {
  margin: 0; padding: 0 4px 4px 0;
}

/* 行 - 上下布局 */
.perm-row {
  display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
}
.perm-row-label {
  font-size: 11px; color: #999;
  line-height: 18px; white-space: nowrap;
}
.perm-row-items {
  display: flex; flex-wrap: wrap; gap: 6px;
}

/* ===== 标签选项 ===== */
.perm-tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 8px 2px 5px; border-radius: 3px;
  cursor: pointer; user-select: none;
  font-size: 12px; line-height: 20px;
  border: 1px solid transparent; background: #fff;
  transition: all 0.12s;
  height: 26px; box-sizing: border-box;
}
.perm-tag:hover { background: #f0f5ff; border-color: #b8d4ff; }
.perm-tag.tag-checked { background: #f0f5ff; border-color: #94bfff; }

/* 复选框 */
.tag-checkbox {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; border-radius: 2px;
  border: 1.5px solid #d0d0d0; background: #fff;
  flex-shrink: 0; transition: all 0.12s;
}
.perm-tag:hover .tag-checkbox { border-color: #165DFF; }
.tag-checkbox.cb-checked { border-color: #165DFF; background: #165DFF; }
.cb-icon { color: #fff; font-size: 10px; font-weight: 700; line-height: 1; }

/* 方法色标 */
.tag-method {
  font-family: 'SF Mono','Menlo',monospace; font-size: 10px; font-weight: 700;
  padding: 0 3px; border-radius: 2px; line-height: 16px; flex-shrink: 0;
}
.tag-GET    .tag-method { background: #e8ffea; color: #00b42a; }
.tag-POST   .tag-method { background: #e8f3ff; color: #165DFF; }
.tag-PUT    .tag-method { background: #fff7e6; color: #e6a23c; }
.tag-DELETE .tag-method { background: #ffece8; color: #f53f3f; }
.tag-PATCH  .tag-method { background: #f5e8ff; color: #722ed1; }

.tag-path {
  font-family: 'SF Mono','Menlo',monospace; font-size: 11px; color: #606266;
}

/* 按钮标签 */
.tag-btn { color: #606266; }
.tag-btn.tag-checked { background: #f0f5ff; border-color: #94bfff; }
</style>

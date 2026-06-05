<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Eye, Search, Settings, Trash2 } from 'lucide-vue-next';

import { useNotifyStore } from '#/store/modules/notify';

const props = withDefaults(
  defineProps<{
    /** Drawer 模式：由父容器控制 activeTab；页面模式：内部管理 */
    activeTab?: 'all' | 'unread';
  }>(),
  {
    activeTab: undefined,
  },
);
const emit = defineEmits<{
  (e: 'update:activeTab', value: 'all' | 'unread'): void;
}>();

const router = useRouter();
const notifyStore = useNotifyStore();

// ==================== 状态 ====================
const internalActiveTab = ref<'all' | 'unread'>('unread');
const activeCategory = ref<string>('');
const selectedIds = ref<(number | string)[]>([]);
const searchKeyword = ref('');

/** 当前使用的 tab（优先外部 props） */
const currentTab = computed(() => props.activeTab ?? internalActiveTab.value);

function setActiveTab(tab: 'all' | 'unread') {
  if (props.activeTab === undefined) {
    internalActiveTab.value = tab;
  } else {
    emit('update:activeTab', tab);
  }
}

// 分页
const pageSize = ref(15);
const currentPage = ref(1);

// ==================== 可拖拽左侧栏宽度 ====================
const sidebarWidth = ref(180);
const isDragging = ref(false);

function onResizeStart(e: MouseEvent) {
  isDragging.value = true;
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;

  function onMouseMove(ev: MouseEvent) {
    const delta = ev.clientX - startX;
    const newWidth = Math.max(120, Math.min(360, startWidth + delta));
    sidebarWidth.value = newWidth;
  }

  function onMouseUp() {
    isDragging.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// ==================== 生命周期 ====================
onMounted(() => {
  notifyStore.loadCategories().then((cats) => {
    categoryOptions.value = Array.isArray(cats) ? cats : [];
  });
  loadData();
});

// ==================== 数据 ====================
const categoryOptions = ref<any[]>([]);

// "未读"标签页：左侧仅显示"全部类型"
// "全部"标签页：左侧渲染所有分类
const displayCategories = computed(() => {
  if (currentTab.value === 'unread') {
    return [
      { key: '', name: '全部类型', unreadCount: notifyStore.unreadCount.total },
    ];
  }
  // 全部标签：显示所有分类（含未读数）
  const cats = categoryOptions.value.map((cat: any) => ({
    ...cat,
    unreadCount:
      notifyStore.unreadCount.categories?.find((c: any) => c.key === cat.key)
        ?.count ?? 0,
  }));
  return [
    { key: '', name: '全部类型', unreadCount: notifyStore.unreadCount.total },
    ...cats,
  ];
});

function loadData() {
  const params: {
    category_key?: string;
    keyword?: string;
    page: number;
    pageSize: number;
    status?: string;
  } = {
    page: currentPage.value,
    pageSize: pageSize.value,
  };
  if (currentTab.value === 'unread') {
    params.status = 'unread';
  }
  if (activeCategory.value) {
    params.category_key = activeCategory.value;
  }
  if (searchKeyword.value.trim()) {
    params.keyword = searchKeyword.value.trim();
  }
  notifyStore.loadMessages(params);
}

// ==================== 计算属性 ====================
const isAllSelected = computed(() => {
  return (
    notifyStore.messageList.length > 0 &&
    selectedIds.value.length === notifyStore.messageList.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedIds.value.length > 0 &&
    selectedIds.value.length < notifyStore.messageList.length
  );
});

const totalPages = computed(() =>
  Math.ceil(notifyStore.totalItems / pageSize.value),
);

// ==================== 事件 ====================
function handleItemClick(item: any) {
  if (item.link) {
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      router.push({ path: item.link, query: item.query || {} });
    }
  }
  if (!item.isRead) {
    notifyStore.markRead(item.id);
  }
}

function selectCategory(key: string) {
  activeCategory.value = activeCategory.value === key ? '' : key;
  currentPage.value = 1;
  selectedIds.value = [];
  loadData();
}

function toggleSelectAll() {
  selectedIds.value = isAllSelected.value
    ? []
    : notifyStore.messageList.map((n: any) => n.id);
}

function toggleSelect(id: number | string) {
  const index = selectedIds.value.indexOf(id);
  if (index === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(index, 1);
  }
}

function isSelected(id: number | string) {
  return selectedIds.value.includes(id);
}

async function handleBatchRead() {
  if (selectedIds.value.length === 0) return;
  await notifyStore.batchMarkRead([...selectedIds.value]);
  selectedIds.value = [];
  loadData();
}

async function handleBatchRemove() {
  if (selectedIds.value.length === 0) return;
  await notifyStore.batchDelete([...selectedIds.value]);
  selectedIds.value = [];
  loadData();
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    selectedIds.value = [];
    loadData();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectedIds.value = [];
    loadData();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    selectedIds.value = [];
    loadData();
  }
}

function openSubscribe() {
  router.push({ path: '/content/message/subscribe' });
}

// 监听标签切换（props 变化或内部切换均触发）
watch([currentTab, activeCategory], () => {
  currentPage.value = 1;
  selectedIds.value = [];
  loadData();
});

watch(searchKeyword, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div
    class="flex h-full overflow-hidden rounded-lg border border-border bg-card"
  >
    <!-- 左侧分类栏 -->
    <div
      class="shrink-0 flex flex-col border-r border-border/30 select-none"
      :style="{ width: `${sidebarWidth}px` }"
    >
      <div class="flex-1 overflow-y-auto py-2">
        <div
          v-for="cat in displayCategories"
          :key="cat.key || 'all'"
          class="mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 text-sm"
          :class="
            activeCategory === cat.key
              ? 'bg-blue-50 text-primary'
              : 'text-muted-foreground hover:bg-accent'
          "
          @click="selectCategory(cat.key)"
        >
          <div class="flex items-center justify-between">
            <span class="truncate">{{ cat.name }}</span>
            <span
              v-if="cat.unreadCount > 0"
              class="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white"
            >
              {{ cat.unreadCount > 99 ? '99+' : cat.unreadCount }}
            </span>
          </div>
        </div>
      </div>
      <div class="border-t border-border/30 px-3 py-2">
        <button
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          @click="openSubscribe"
        >
          <Settings class="size-3.5" />
          <span>消息订阅设置</span>
        </button>
      </div>
    </div>

    <!-- 可拖拽分隔条 -->
    <div
      class="w-[5px] cursor-col-resize shrink-0 relative group"
      @mousedown="onResizeStart"
    >
      <div
        class="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-border/40 transition-colors group-hover:bg-primary/60"
      ></div>
    </div>

    <!-- 右侧消息列表 -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- 插槽：父级传入标签栏（Drawer 模式） -->
      <slot name="tabs">
        <!-- 页面模式下的内置标签栏 -->
        <div
          v-if="activeTab === undefined"
          class="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border/30 bg-muted/20"
        >
          <button
            class="relative text-sm font-medium transition-colors"
            :class="
              currentTab === 'unread'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setActiveTab('unread')"
          >
            未读
            <span
              v-if="notifyStore.unreadCount.total > 0"
              class="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] text-white"
            >
              {{
                notifyStore.unreadCount.total > 99
                  ? '99+'
                  : notifyStore.unreadCount.total
              }}
            </span>
          </button>
          <span class="text-muted-foreground/20">|</span>
          <button
            class="relative text-sm font-medium transition-colors"
            :class="
              currentTab === 'all'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setActiveTab('all')"
          >
            全部
          </button>
        </div>
      </slot>
      <!-- 搜索栏 -->
      <div class="shrink-0 border-b border-border/30 px-4 py-3">
        <div class="relative w-80">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索消息标题、内容..."
            class="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary"
            @keyup.enter="loadData"
          />
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="flex-1 overflow-y-auto" style="overflow-x: hidden">
        <table class="w-full border-collapse text-sm">
          <thead class="sticky top-0 z-10 bg-muted/80">
            <tr class="border-b border-border">
              <th class="px-3 py-2.5 text-left" style="width: 40px">
                <input
                  type="checkbox"
                  class="size-3.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                />
              </th>
              <th
                class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground"
                style="width: 40px"
              >
                查看
              </th>
              <th
                class="px-2 py-2.5 text-left text-xs font-normal text-muted-foreground"
              >
                消息标题
              </th>
              <th
                class="px-2 py-2.5 text-left text-xs font-normal text-muted-foreground"
              >
                消息内容
              </th>
              <th
                class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground"
                style="width: 80px"
              >
                类型
              </th>
              <th
                class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground"
                style="width: 100px"
              >
                发送时间
              </th>
              <th
                class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground"
                style="width: 80px"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr
              v-for="item in notifyStore.messageList"
              :key="item.id"
              class="transition-colors hover:bg-accent/30"
              :class="{ 'bg-blue-50/50': !item.isRead }"
            >
              <td class="px-3 py-2.5" style="width: 40px">
                <input
                  type="checkbox"
                  class="size-3.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
                  :checked="isSelected(item.id)"
                  @change="toggleSelect(item.id)"
                />
              </td>
              <td class="px-2 py-2.5 text-center" style="width: 40px">
                <button
                  class="inline-flex items-center justify-center rounded p-1 text-muted-foreground/70 hover:bg-accent hover:text-primary transition-colors"
                  @click.stop="handleItemClick(item)"
                >
                  <Eye class="size-4" />
                </button>
              </td>
              <td class="px-2 py-2.5">
                <span
                  class="text-sm truncate"
                  :class="
                    item.isRead
                      ? 'text-muted-foreground'
                      : 'text-foreground font-medium'
                  "
                  >{{ item.title }}</span
                >
              </td>
              <td class="px-2 py-2.5">
                <span class="text-sm text-muted-foreground truncate">{{
                  item.content || '-'
                }}</span>
              </td>
              <td class="px-2 py-2.5 text-center" style="width: 80px">
                <span class="inline-flex text-xs text-muted-foreground">
                  {{
                    categoryOptions.find((c: any) => c.key === item.category)
                      ?.name || '通知'
                  }}
                </span>
              </td>
              <td
                class="px-2 py-2.5 text-center text-xs text-muted-foreground"
                style="width: 100px"
              >
                {{ item.date }}
              </td>
              <td class="px-2 py-2.5 text-center" style="width: 80px">
                <button
                  class="text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                  @click.stop="handleItemClick(item)"
                >
                  立即查看
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 底部分页和操作栏 -->
      <div
        class="flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5"
      >
        <div class="flex items-center gap-2">
          <button
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedIds.length === 0"
            @click="handleBatchRead"
          >
            标记为已读
          </button>
          <button
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedIds.length === 0"
            @click="handleBatchRemove"
          >
            <span class="flex items-center gap-1">
              <Trash2 class="size-3" />
              批量删除
            </span>
          </button>
          <button
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors"
            @click="notifyStore.markAllRead()"
          >
            全部已读
          </button>
        </div>

        <span class="text-xs text-muted-foreground">
          共 {{ notifyStore.totalItems }} 条，已选 {{ selectedIds.length }} 项
        </span>

        <div class="flex items-center gap-2">
          <select
            v-model="pageSize"
            class="h-8 rounded-md border border-border bg-background px-2 text-xs"
            @change="
              currentPage = 1;
              loadData();
            "
          >
            <option :value="10">10条/页</option>
            <option :value="15">15条/页</option>
            <option :value="20">20条/页</option>
            <option :value="50">50条/页</option>
          </select>

          <div class="flex items-center">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              &lt;
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="flex h-8 min-w-[32px] items-center justify-center border border-r-0 border-border px-2 text-xs transition-colors"
              :class="
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'text-foreground hover:bg-accent'
              "
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-r-md border border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

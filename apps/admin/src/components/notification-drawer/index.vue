<script lang="ts" setup>
import type { NotificationCategory, NotificationItem } from './types';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Bell, Eye, MailOpen, Trash2, X, Settings, GripVertical, Search } from 'lucide-vue-next';
import { useVbenDrawer } from '@vben/common-ui';

import {
  DEFAULT_CATEGORIES,
} from './types';

const router = useRouter();

// ==================== Props & Emits ====================

const props = withDefaults(
  defineProps<{
    /** 所有通知数据 */
    notifications?: NotificationItem[];
    /** 分类列表 */
    categories?: NotificationCategory[];
  }>(),
  {
    notifications: () => [],
    categories: () => DEFAULT_CATEGORIES,
  },
);

const emit = defineEmits<{
  (e: 'read', item: NotificationItem): void;
  (e: 'read-all'): void;
  (e: 'remove', item: NotificationItem): void;
  (e: 'click', item: NotificationItem): void;
  (e: 'batch-read', ids: (string | number)[]): void;
  (e: 'batch-remove', ids: (string | number)[]): void;
}>();

// ==================== 状态 ====================

const activeTab = ref<'unread' | 'all'>('all');
const activeCategory = ref<string>('');
const selectedIds = ref<(string | number)[]>([]);
const searchKeyword = ref('');

// 分页
const pageSize = ref(15);
const currentPage = ref(1);

// 左侧分类宽度
const sidebarWidth = ref(140);
const minSidebarWidth = 100;
const maxSidebarWidth = 250;
const isDragging = ref(false);

// ==================== Drawer API ====================
const [Drawer, drawerApi] = useVbenDrawer({
  placement: 'right',
  closable: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
});

// 拖拽处理
let startX = 0;
let startWidth = 0;

function onDragStart(e: MouseEvent) {
  isDragging.value = true;
  startX = e.clientX;
  startWidth = sidebarWidth.value;
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const deltaX = e.clientX - startX;
  const newWidth = startWidth + deltaX;
  sidebarWidth.value = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, newWidth));
}

function onDragEnd() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

// 监听抽屉打开状态，重置分页
watch(
  () => drawerApi.store.state.isOpen,
  (val) => {
    if (val) {
      currentPage.value = 1;
      selectedIds.value = [];
    }
  },
);

// ==================== 计算属性 ====================

/** 是否全选 */
const isAllSelected = computed(() => {
  return paginatedNotifications.value.length > 0 && selectedIds.value.length === paginatedNotifications.value.length;
});

/** 是否部分选中 */
const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < paginatedNotifications.value.length;
});

/** 未读消息数 */
const unreadCount = computed(() =>
  props.notifications.filter((n) => !n.isRead).length,
);

/** 根据 tab、分类和搜索关键词筛选 */
const filteredNotifications = computed(() => {
  let list = props.notifications;

  // tab 筛选
  if (activeTab.value === 'unread') {
    list = list.filter((n) => !n.isRead);
  }

  // 分类筛选
  if (activeCategory.value) {
    list = list.filter((n) => n.category === activeCategory.value);
  }

  // 搜索筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(keyword) ||
        n.content.toLowerCase().includes(keyword) ||
        n.category.toLowerCase().includes(keyword)
    );
  }

  return list;
});

/** 分页后的数据 */
const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredNotifications.value.slice(start, start + pageSize.value);
});

/** 总页数 */
const totalPages = computed(() => {
  return Math.ceil(filteredNotifications.value.length / pageSize.value);
});

/** 带未读数的分类 */
const categoryList = computed(() => {
  return props.categories.map((cat) => {
    const all = props.notifications.filter((n) => n.category === cat.key);
    const unread = all.filter((n) => !n.isRead).length;
    return { ...cat, unreadCount: unread };
  });
});

// ==================== 方法 ====================

function handleItemClick(item: NotificationItem) {
  emit('click', item);

  // 自动跳转
  if (item.link) {
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      router.push({ path: item.link, query: item.query || {} });
    }
  }

  // 标记已读
  if (!item.isRead) {
    handleRead(item);
  }
}

function handleRead(item: NotificationItem) {
  emit('read', item);
}

function handleReadAll() {
  emit('read-all');
  selectedIds.value = [];
}

function handleRemove(item: NotificationItem) {
  emit('remove', item);
}

function selectCategory(key: string) {
  activeCategory.value = activeCategory.value === key ? '' : key;
  currentPage.value = 1;
  selectedIds.value = [];
}

/** 全选/反选 */
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = paginatedNotifications.value.map((n) => n.id);
  }
}

/** 单选/取消选择 */
function toggleSelect(id: string | number) {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
}

/** 是否选中 */
function isSelected(id: string | number) {
  return selectedIds.value.includes(id);
}

/** 批量标记已读 */
function handleBatchRead() {
  if (selectedIds.value.length > 0) {
    emit('batch-read', [...selectedIds.value]);
    selectedIds.value = [];
  }
}

/** 批量删除 */
function handleBatchRemove() {
  if (selectedIds.value.length > 0) {
    emit('batch-remove', [...selectedIds.value]);
    selectedIds.value = [];
  }
}

/** 跳转到指定页 */
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    selectedIds.value = [];
  }
}

/** 上一页 */
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    selectedIds.value = [];
  }
}

/** 下一页 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    selectedIds.value = [];
  }
}

// 监听 tab 或分类变化，重置分页
watch([activeTab, activeCategory], () => {
  currentPage.value = 1;
  selectedIds.value = [];
});
</script>

<template>
  <!-- ========== 触发器（铃铛按钮） ========== -->
  <div
    class="relative flex items-center"
    :class="{ 'cursor-pointer': true }"
    @click="drawerApi.open()"
  >
    <Bell class="size-[18px] text-foreground hover:text-primary transition-colors" />
    <!-- 未读红点 -->
    <span
      v-if="unreadCount > 0"
      class="absolute -right-0.5 -top-0.5 flex size-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </span>
  </div>

  <!-- ========== 抽屉 ========== -->
  <Drawer class="w-[80%]" :footer="false">
    <template #title>
      <div class="flex items-center gap-4">
        <button
          class="relative px-4 py-1.5 text-sm font-medium transition-colors"
          :class="activeTab === 'unread' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'unread'"
        >
          未读
          <span
            v-if="unreadCount > 0"
            class="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-normal text-white"
          >
            {{ unreadCount }}
          </span>
          <span
            v-if="activeTab === 'unread'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          />
        </button>
        <button
          class="relative px-4 py-1.5 text-sm font-medium transition-colors"
          :class="activeTab === 'all' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'all'"
        >
          全部
          <span
            v-if="activeTab === 'all'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          />
        </button>
      </div>
    </template>
    <!-- 主体：左侧分类 + 右侧列表 -->
    <div class="flex h-full overflow-hidden" style="overflow-x: hidden;">
      <!-- 左侧分类 -->
      <div
        class="shrink-0 flex flex-col border-r border-border/30 py-2"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="cat in categoryList"
            :key="cat.key"
            class="mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 text-sm"
            :class="
              activeCategory === cat.key
                ? 'text-primary bg-blue-50'
                : 'text-muted-foreground'
            "
            @click="selectCategory(cat.key)"
          >
            <span class="truncate">{{ cat.name }}</span>
          </div>
        </div>
        <div class="mt-auto pt-2 border-t border-border/30 mx-2 mb-2">
          <div
            class="cursor-pointer rounded-md px-3 py-2 text-sm text-muted-foreground flex items-center gap-2"
          >
            <Settings class="size-3" />
            <span class="truncate">消息订阅设置</span>
          </div>
        </div>
      </div>

      <!-- 拖拽分隔条 -->
      <div
        class="w-1 shrink-0 cursor-col-resize hover:bg-border/50 transition-colors flex items-center justify-center"
        :class="{ 'bg-blue-500': isDragging }"
        @mousedown="onDragStart"
      >
        <GripVertical class="size-4 text-muted-foreground opacity-50" />
      </div>

      <!-- 右侧通知列表 -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- 空状态 -->
        <div
          v-if="filteredNotifications.length === 0"
          class="flex flex-1 items-center justify-center"
        >
          <div class="flex flex-col items-center gap-4 text-muted-foreground">
            <div class="relative">
              <MailOpen class="size-14 opacity-20" />
              <div class="absolute inset-0 flex items-center justify-center">
                <Bell class="size-6 opacity-30" />
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-muted-foreground/80">
                {{ activeTab === 'unread' ? '暂无未读消息' : '暂无消息' }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground/50">
                {{ activeTab === 'unread' ? '您已阅读所有消息' : '消息通知将在这里显示' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 通知表格 -->
        <div v-else class="flex flex-1 flex-col overflow-hidden">
          <!-- 搜索栏 -->
          <div class="shrink-0 px-4 py-3">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索消息标题、内容或类型..."
                class="h-9 w-1/3 rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary"
                @keyup.enter="currentPage = 1"
              />
            </div>
          </div>

          <!-- 表格区域 -->
          <div class="flex-1 overflow-y-auto px-4" style="overflow-x: hidden;">
            <table class="w-full border-collapse text-sm" style="table-layout: fixed;">
              <!-- 表头 -->
              <thead class="sticky top-0 z-10 bg-muted/80">
                <tr class="border-b border-border">
                  <!-- 全选 -->
                  <th class="w-10 px-3 py-2.5 text-left" style="width: 40px;">
                    <input
                      type="checkbox"
                      class="size-3.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
                      :checked="isAllSelected"
                      :indeterminate="isIndeterminate"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <!-- 查看 -->
                  <th class="w-10 px-2 py-2.5 text-center text-xs font-normal text-muted-foreground" style="width: 40px;">
                    查看
                  </th>
                  <!-- 标题 -->
                  <th class="px-2 py-2.5 text-left text-xs font-normal text-muted-foreground" style="min-width: 140px;">
                    消息标题
                  </th>
                  <!-- 内容 -->
                  <th class="px-2 py-2.5 text-left text-xs font-normal text-muted-foreground" style="min-width: 180px;">
                    消息内容
                  </th>
                  <!-- 类型 -->
                  <th class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground" style="width: 80px;">
                    类型
                  </th>
                  <!-- 发送时间 -->
                  <th class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground" style="width: 100px;">
                    发送时间
                  </th>
                  <!-- 操作 -->
                  <th class="px-2 py-2.5 text-center text-xs font-normal text-muted-foreground" style="width: 80px;">
                    操作
                  </th>
                </tr>
              </thead>
              <!-- 表体 -->
              <tbody class="divide-y divide-border/50">
                <tr
                  v-for="item in paginatedNotifications"
                  :key="item.id"
                  class="transition-colors hover:bg-accent/30"
                  :class="{ 'bg-blue-50/50': !item.isRead }"
                >
                  <!-- 复选框 -->
                  <td class="px-3 py-2.5" style="width: 40px;">
                    <input
                      type="checkbox"
                      class="size-3.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
                      :checked="isSelected(item.id)"
                      @change="toggleSelect(item.id)"
                    />
                  </td>
                  <!-- 查看图标 -->
                  <td class="px-2 py-2.5 text-center" style="width: 40px;">
                    <button
                      class="inline-flex items-center justify-center rounded p-1 text-muted-foreground/70 hover:bg-accent hover:text-primary transition-colors"
                      @click.stop="handleItemClick(item)"
                    >
                      <Eye class="size-4" />
                    </button>
                  </td>
                  <!-- 标题 -->
                  <td class="px-2 py-2.5" style="min-width: 140px;">
                    <span class="text-sm truncate" :class="item.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'">
                      {{ item.title }}
                    </span>
                  </td>
                  <!-- 内容 -->
                  <td class="px-2 py-2.5" style="min-width: 180px;">
                    <span class="text-sm text-muted-foreground truncate">
                      {{ item.content || '-' }}
                    </span>
                  </td>
                  <!-- 类型 -->
                  <td class="px-2 py-2.5 text-center" style="width: 80px;">
                    <span class="inline-flex text-xs text-muted-foreground">
                      {{ categoryList.find((cat) => cat.key === item.category)?.name || '通知' }}
                    </span>
                  </td>
                  <!-- 发送时间 -->
                  <td class="px-2 py-2.5 text-center text-xs text-muted-foreground" style="width: 100px;">
                    {{ item.date }}
                  </td>
                  <!-- 操作 -->
                  <td class="px-2 py-2.5 text-center" style="width: 80px;">
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
          <div class="flex shrink-0 items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5">
            <!-- 左侧批量操作 -->
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
                @click="handleReadAll"
              >
                全部已读
              </button>
            </div>
            
            <!-- 中间统计 -->
            <span class="text-xs text-muted-foreground">
              共 {{ filteredNotifications.length }} 条，已选 {{ selectedIds.length }} 项
            </span>

            <!-- 右侧：每页条数 + 分页按钮 -->
            <div class="flex items-center gap-2">
              <!-- 每页条数 -->
              <select
                v-model="pageSize"
                class="h-8 rounded-md border border-border bg-background px-2 text-xs"
                @change="currentPage = 1"
              >
                <option :value="10">10条/页</option>
                <option :value="15">15条/页</option>
                <option :value="20">20条/页</option>
                <option :value="50">50条/页</option>
              </select>
              
              <!-- 分页按钮 -->
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
                  :class="currentPage === page ? 'bg-blue-500 text-white' : 'text-foreground hover:bg-accent'"
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
    </div>
  </Drawer>
</template>

<style scoped>
</style>

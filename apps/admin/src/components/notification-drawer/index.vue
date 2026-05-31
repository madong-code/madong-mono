<script lang="ts" setup>
import type { NotificationCategory, NotificationItem } from './types';

import type { UnreadCountData } from '#/api/notification/types';

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';

import {
  Bell,
  Eye,
  MailOpen,
  Search,
  Settings,
  Trash2,
} from 'lucide-vue-next';

import { NotificationApi, NotificationCategoryApi } from '#/api/notification';
import NotificationSubscribe from '#/components/notification-subscribe/notification-subscribe.vue';
import { createSSEClient } from '#/utils/sse';

const router = useRouter();

// ==================== 数据状态 ====================

const notificationList = ref<NotificationItem[]>([]);
const totalItems = ref(0);
const categoryListRaw = ref<NotificationCategory[]>([]);
const unreadCountData = ref<UnreadCountData>({ total: 0, categories: [] });

// ==================== 状态 ====================

const activeTab = ref<'all' | 'unread'>('all');
const activeCategory = ref<string>('');
const selectedIds = ref<(number | string)[]>([]);
const searchKeyword = ref('');

// 分页
const pageSize = ref(15);
const currentPage = ref(1);

// 加载状态
const loading = ref(false);

// ==================== Drawer API ====================
const [Drawer, drawerApi] = useVbenDrawer({
  placement: 'right',
  closable: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
});

// 监听抽屉打开
watch(
  () => drawerApi.store.state.isOpen,
  (val) => {
    if (val) {
      currentPage.value = 1;
      selectedIds.value = [];
      loadData();
      loadCategories();
      loadUnreadCount();
    }
  },
);

// ==================== 计算属性 ====================

const isAllSelected = computed(() => {
  return (
    notificationList.value.length > 0 &&
    selectedIds.value.length === notificationList.value.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedIds.value.length > 0 &&
    selectedIds.value.length < notificationList.value.length
  );
});

const unreadCount = computed(() => unreadCountData.value.total);

const categoryList = computed(() => {
  const unreadMap = new Map<string, number>();
  for (const c of unreadCountData.value.categories ?? []) {
    unreadMap.set(c.key, c.count);
  }
  return categoryListRaw.value.map((cat) => ({
    ...cat,
    unreadCount: unreadMap.get(cat.key) ?? 0,
  }));
});

// ==================== API 方法 ====================

async function loadData() {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: pageSize.value,
    };
    if (activeTab.value === 'unread') {
      params.status = 'unread';
    }
    if (activeCategory.value) {
      params.category_key = activeCategory.value;
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }

    const resp = await NotificationApi.getList(params);
    notificationList.value = (resp.list ?? []).map((item) => normalizeNotification(item));
    totalItems.value = resp.total ?? 0;
  } catch (error: any) {
    console.error('加载消息列表失败', error);
  } finally {
    loading.value = false;
  }
}

function normalizeNotification(item: any): NotificationItem {
  return {
    id: item.id,
    category: item.category_key ?? '',
    category_name: item.category_name,
    module_key: item.module_key,
    title: item.title ?? '',
    content: item.content ?? '',
    date: item.created_at
      ? new Date(item.created_at).toLocaleString('zh-CN', { hour12: false })
      : '',
    isRead: item.status === 'read',
    link: item.action_url ?? '',
    query: item.action_params ?? item.extra_data ?? {},
    actionText: '立即查看',
    priority: item.priority,
    sender_id: item.sender_id,
    read_at: item.read_at,
    created_at: item.created_at,
  };
}

async function loadCategories() {
  try {
    categoryListRaw.value = await NotificationCategoryApi.getAll();
  } catch (error) {
    console.error('加载分类失败', error);
  }
}

async function loadUnreadCount() {
  try {
    unreadCountData.value = await NotificationApi.getUnreadCount();
  } catch (error) {
    console.error('加载未读数失败', error);
  }
}

// ==================== 事件处理 ====================

function handleItemClick(item: NotificationItem) {
  if (item.link) {
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      router.push({ path: item.link, query: item.query || {} });
    }
  }
  if (!item.isRead) {
    handleRead(item);
  }
  drawerApi.close();
}

function handleRead(item: NotificationItem) {
  NotificationApi.markRead(item.id)
    .then(() => {
      item.isRead = true;
      loadUnreadCount();
    })
    .catch((error) => console.error('标记已读失败', error));
}

function handleReadAll() {
  NotificationApi.markAllRead()
    .then(() => {
      notificationList.value.forEach((n) => (n.isRead = true));
      loadUnreadCount();
    })
    .catch((error) => console.error('全部标记已读失败', error));
}

function selectCategory(key: string) {
  activeCategory.value = activeCategory.value === key ? '' : key;
  currentPage.value = 1;
  selectedIds.value = [];
  loadData();
}

function toggleSelectAll() {
  selectedIds.value = isAllSelected.value ? [] : notificationList.value.map((n) => n.id);
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
  try {
    await NotificationApi.batchMarkRead([...selectedIds.value]);
    notificationList.value.forEach((n) => {
      if (selectedIds.value.includes(n.id)) n.isRead = true;
    });
    selectedIds.value = [];
    loadUnreadCount();
  } catch (error) {
    console.error('批量标记已读失败', error);
  }
}

async function handleBatchRemove() {
  if (selectedIds.value.length === 0) return;
  try {
    await NotificationApi.batchDelete([...selectedIds.value]);
    notificationList.value = notificationList.value.filter(
      (n) => !selectedIds.value.includes(n.id),
    );
    selectedIds.value = [];
    loadUnreadCount();
  } catch (error) {
    console.error('批量删除失败', error);
  }
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

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// ==================== SSE ====================

let sseClient: any = null;

onMounted(() => {
  loadUnreadCount();
  sseClient = createSSEClient({
    url: '/adminapi/notification/sse',
    onMessage: (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.total !== undefined) {
          unreadCountData.value = {
            total: data.total,
            categories: data.categories || [],
          };
        }
      } catch (error) {
        console.error('[SSE] 解析数据失败:', error);
      }
    },
    onError: (error: Event) => console.error('[SSE] 连接错误:', error),
    onClose: () => console.warn('[SSE] 连接已关闭'),
    onOpen: () => console.warn('[SSE] 连接已建立'),
  });
  sseClient.connect();
});

onBeforeUnmount(() => {
  if (sseClient) {
    sseClient.disconnect();
    sseClient = null;
  }
});

// ==================== 订阅设置 ====================

const subscribeDialogRef = ref<InstanceType<
  typeof NotificationSubscribe
> | null>(null);

function openSubscribeDialog() {
  subscribeDialogRef.value?.open();
}

watch([activeTab, activeCategory], () => {
  currentPage.value = 1;
  selectedIds.value = [];
  loadData();
});

watch(searchKeyword, () => {
  currentPage.value = 1;
});
</script>

<template>
  <!-- 触发器（铃铛按钮） -->
  <div
    class="relative flex items-center cursor-pointer"
    @click="drawerApi.open()"
  >
    <Bell
      class="size-[18px] text-foreground hover:text-primary transition-colors"
    />
    <span
      v-if="unreadCount > 0"
      class="absolute -right-0.5 -top-0.5 flex size-[16px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </span>
  </div>

  <!-- 抽屉 -->
  <Drawer class="w-[80%]" :footer="false">
    <template #title>
      <div class="flex items-center gap-4">
        <button
          class="relative px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            activeTab === 'unread'
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
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
          ></span>
        </button>
        <button
          class="relative px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            activeTab === 'all'
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = 'all'"
        >
          全部
          <span
            v-if="activeTab === 'all'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          ></span>
        </button>
      </div>
    </template>

    <div class="flex h-full overflow-hidden" style="overflow-x: hidden">
      <!-- 左侧分类 -->
      <div
        class="shrink-0 flex flex-col border-r border-border/30 py-2"
        style="width: 140px"
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
            <span
              v-if="cat.unreadCount > 0"
              class="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white"
            >
              {{ cat.unreadCount > 99 ? '99+' : cat.unreadCount }}
            </span>
          </div>
        </div>
        <div class="mt-auto pt-2 border-t border-border/30 mx-2 mb-2">
          <div
            class="cursor-pointer rounded-md px-3 py-2 text-sm text-muted-foreground flex items-center gap-2"
            @click="openSubscribeDialog()"
          >
            <Settings class="size-3" />
            <span class="truncate">消息订阅设置</span>
          </div>
        </div>
      </div>

      <!-- 右侧通知列表 -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- 空状态 -->
        <div
          v-if="notificationList.length === 0 && !loading"
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
                {{
                  activeTab === 'unread'
                    ? '您已阅读所有消息'
                    : '消息通知将在这里显示'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- 通知表格 -->
        <div v-else class="flex flex-1 flex-col overflow-hidden">
          <!-- 搜索栏 -->
          <div class="shrink-0 px-4 py-3">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索消息标题、内容..."
                class="h-9 w-1/3 rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary"
                @keyup.enter="
                  currentPage = 1;
                  loadData();
                "
              />
            </div>
          </div>

          <!-- 表格区域 -->
          <div class="flex-1 overflow-y-auto px-4" style="overflow-x: hidden">
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
                  v-for="item in notificationList"
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
                    >
                      {{ item.title }}
                    </span>
                  </td>
                  <td class="px-2 py-2.5">
                    <span class="text-sm text-muted-foreground truncate">
                      {{ item.content || '-' }}
                    </span>
                  </td>
                  <td class="px-2 py-2.5 text-center" style="width: 80px">
                    <span class="inline-flex text-xs text-muted-foreground">
                      {{
                        categoryList.find((cat) => cat.key === item.category)
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
                @click="handleReadAll"
              >
                全部已读
              </button>
            </div>

            <span class="text-xs text-muted-foreground">
              共 {{ totalItems }} 条，已选 {{ selectedIds.length }} 项
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
    </div>
  </Drawer>

  <!-- 订阅设置弹窗 -->
  <NotificationSubscribe ref="subscribeDialogRef" />
</template>

<style scoped></style>

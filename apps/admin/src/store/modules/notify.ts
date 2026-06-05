import type { UnreadCountData } from '#/api/content/message/notify/types';

import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  MessageCategoryApi,
  MessageNotifyApi,
  MessageSubscribeApi,
} from '#/api/content/message/notify';
// @ts-expect-error: push-vue.js has no type declarations
import { Push } from '#/utils/push/push-vue.js';

export interface MessageTypeItem {
  key: string;
  name: string;
  description?: string;
  modules?: { description?: string; key: string; name: string; }[];
  category_subscribed: boolean;
  modules_subscribed: Record<string, boolean>;
}

// 全局 Push 连接（Store 多次创建时复用）
let pushClient: InstanceType<typeof Push> | null = null;

export const useNotifyStore = defineStore('notify', () => {
  // ========== 状态 ==========
  const unreadCount = ref<UnreadCountData>({ total: 0, categories: [] });
  const messageList = ref<any[]>([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const pushConnected = ref(false);

  const subscribeList = ref<MessageTypeItem[]>([]);
  const subscribeLoading = ref(false);

  // ========== Push 连接管理 ==========
  function initPush() {
    if (pushClient) return;

    const wssEnabled = import.meta.env.VITE_GLOB_ENABLE_WSS === 'true';
    if (!wssEnabled) return;

    const wssUrl = import.meta.env.VITE_GLOB_WSS_URL;
    const appKey = import.meta.env.VITE_GLOB_WSS_APPKEY;
    if (!wssUrl || !appKey) {
      console.warn('[NotifyStore] WSS 未配置');
      return;
    }

    const userStore = useUserStore();
    const userId = (userStore.userInfo as Record<string, any>)?.id || '0';
    const tenantId =
      (userStore.userInfo as Record<string, any>)?.current_tenant?.id || '*';

    pushClient = new Push({
      url: wssUrl,
      app_key: appKey,
      auth: '/adminapi/plugin/webman/push/auth',
    });

    // 订阅个人消息通道 backend-admin-{tenantId}-{userId}
    const channel = pushClient.subscribe(`backend-admin-${tenantId}-${userId}`);
    channel.on('message', (data: any) => {
      const messages = data.messages || data;
      const list = Array.isArray(messages) ? messages : [messages];
      for (const msg of list) {
        if (msg.type === 'unread_count' && msg.data) {
          unreadCount.value = {
            total: msg.data.total ?? 0,
            categories: msg.data.categories ?? [],
          };
        }
      }
    });

    pushConnected.value = true;
    loadUnreadCount();
  }

  function destroyPush() {
    // Push 连接由 Push 内部管理生命周期，不主动断开
  }

  // ========== 数据加载 ==========
  async function loadMessages(params: {
    category_key?: string;
    keyword?: string;
    page: number;
    pageSize: number;
    status?: string;
  }) {
    loading.value = true;
    try {
      const resp = await MessageNotifyApi.getList({
        page: params.page,
        limit: params.pageSize,
        status: params.status,
        category_key: params.category_key,
        keyword: params.keyword,
      });
      messageList.value = (resp.list ?? []).map((item) => normalizeItem(item));
      totalItems.value = resp.total ?? 0;
    } catch (error) {
      console.error('[NotifyStore] 加载消息列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function loadUnreadCount() {
    try {
      unreadCount.value = await MessageNotifyApi.getUnreadCount();
    } catch (error) {
      console.error('[NotifyStore] 加载未读数失败:', error);
    }
  }

  async function loadCategories() {
    try {
      return await MessageCategoryApi.getAll();
    } catch (error) {
      console.error('[NotifyStore] 加载分类失败:', error);
      return [];
    }
  }

  // ========== 消息操作 ==========
  async function markRead(id: number | string) {
    try {
      await MessageNotifyApi.markRead(id);
      await loadUnreadCount();
    } catch (error) {
      console.error('[NotifyStore] 标记已读失败:', error);
    }
  }

  async function batchMarkRead(ids: (number | string)[]) {
    try {
      await MessageNotifyApi.batchMarkRead(ids);
      await loadUnreadCount();
    } catch (error) {
      console.error('[NotifyStore] 批量标记已读失败:', error);
    }
  }

  async function markAllRead() {
    try {
      await MessageNotifyApi.markAllRead();
      messageList.value.forEach((n) => (n.isRead = true));
      await loadUnreadCount();
    } catch (error) {
      console.error('[NotifyStore] 全部标记已读失败:', error);
    }
  }

  async function batchDelete(ids: (number | string)[]) {
    try {
      await MessageNotifyApi.batchDelete(ids);
      messageList.value = messageList.value.filter((n) => !ids.includes(n.id));
      await loadUnreadCount();
    } catch (error) {
      console.error('[NotifyStore] 批量删除失败:', error);
    }
  }

  // ========== 订阅管理 ==========
  async function loadSubscriptions() {
    subscribeLoading.value = true;
    try {
      const categories = await MessageCategoryApi.getAll();
      const subscribeData = await MessageSubscribeApi.getMine();

      const list: MessageTypeItem[] = (
        Array.isArray(categories) ? categories : []
      ).map((cat: any) => {
        const catSub = (Array.isArray(subscribeData) ? subscribeData : []).find(
          (s: any) => s.category_key === cat.key,
        );
        const modulesSubscribed: Record<string, boolean> = {};
        if (cat.modules) {
          for (const mod of cat.modules) {
            const modSub = catSub?.modules?.find(
              (m: any) => m.module_key === mod.key,
            );
            modulesSubscribed[mod.key] = modSub?.is_subscribed ?? true;
          }
        }
        return {
          key: cat.key,
          name: cat.name,
          description: cat.description,
          modules: cat.modules,
          category_subscribed: catSub?.is_subscribed ?? true,
          modules_subscribed: modulesSubscribed,
        };
      });
      subscribeList.value = list;
    } catch (error) {
      console.error('[NotifyStore] 加载订阅列表失败:', error);
    } finally {
      subscribeLoading.value = false;
    }
  }

  async function toggleSubscription(categoryKey: string, moduleKey?: string) {
    const item = subscribeList.value.find((s) => s.key === categoryKey);
    if (!item) return;
    try {
      if (moduleKey) {
        item.modules_subscribed[moduleKey] =
          !item.modules_subscribed[moduleKey];
        await MessageSubscribeApi.batchSet([
          {
            category_key: categoryKey,
            module_key: moduleKey,
            is_subscribed: item.modules_subscribed[moduleKey],
          },
        ]);
      } else {
        item.category_subscribed = !item.category_subscribed;
        await MessageSubscribeApi.batchSet([
          {
            category_key: categoryKey,
            module_key: null,
            is_subscribed: item.category_subscribed,
          },
        ]);
      }
    } catch (error) {
      console.error('[NotifyStore] 切换订阅失败:', error);
      if (moduleKey) {
        item.modules_subscribed[moduleKey] =
          !item.modules_subscribed[moduleKey];
      } else {
        item.category_subscribed = !item.category_subscribed;
      }
    }
  }

  // ========== 工具函数 ==========
  function normalizeItem(item: any): any {
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
      query: item.action_params
        ? (typeof item.action_params === 'string'
          ? JSON.parse(item.action_params)
          : item.action_params)
        : {},
      actionText: '立即查看',
      priority: item.priority,
      sender_id: item.sender_id,
      read_at: item.read_at,
      created_at: item.created_at,
    };
  }

  return {
    unreadCount,
    messageList,
    totalItems,
    loading,
    pushConnected,
    subscribeList,
    subscribeLoading,

    initPush,
    destroyPush,

    loadMessages,
    loadUnreadCount,
    loadCategories,

    markRead,
    batchMarkRead,
    markAllRead,
    batchDelete,

    loadSubscriptions,
    toggleSubscription,
  };
});

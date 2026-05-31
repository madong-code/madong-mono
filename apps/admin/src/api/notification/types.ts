/** 通知分类 */
export interface NotificationCategory {
  id?: number | string;
  key: string;
  name: string;
  icon?: string;
  description?: string;
  sort?: number;
  is_system?: boolean;
  is_enabled?: boolean;
  tenant_id?: null | string;
  created_at?: null | number;
  updated_at?: null | number;
}

/** 通知订阅设置（按分类分组） */
export interface NotificationSubscribeGrouped {
  category_key: string;
  is_subscribed: boolean;
  modules: NotificationSubscribeModule[];
}

export interface NotificationSubscribeModule {
  module_key: string;
  is_subscribed: boolean;
}

/** 订阅设置（扁平） */
export interface NotificationSubscribe {
  id?: number | string;
  user_id: string;
  category_key: string;
  module_key?: null | string;
  is_subscribed: boolean;
  tenant_id?: null | string;
}

/** 未读数响应 */
export interface UnreadCountData {
  total: number;
  categories: { count: number; key: string; }[];
}

/** 通知消息项（前端 drawer 用） */
export interface NotificationItem {
  id: number | string;
  /** 分类 key */
  category: string;
  /** 分类名称（后端返回） */
  category_name?: string;
  /** 模块 key */
  module_key?: string;
  title: string;
  content?: string;
  date: string;
  isRead?: boolean;
  /** 跳转链接（后端 action_url） */
  link?: string;
  query?: Record<string, any>;
  actionText?: string;
  /** 扩展数据 */
  extra_data?: Record<string, any>;
  /** 优先级 */
  priority?: number;
  sender_id?: string;
  receiver_id?: string;
  read_at?: null | number;
  created_at?: number;
}

/** 消息列表响应 */
export interface NotificationListResponse {
  list: NotificationItem[];
  total: number;
}

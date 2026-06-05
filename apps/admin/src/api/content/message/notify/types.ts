/** 消息分类 */
export interface MessageCategory {
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

/** 消息订阅设置（按分类分组） */
export interface MessageSubscribeGrouped {
  category_key: string;
  is_subscribed: boolean;
  modules: MessageSubscribeModule[];
}

export interface MessageSubscribeModule {
  module_key: string;
  is_subscribed: boolean;
}

/** 未读数响应 */
export interface UnreadCountData {
  total: number;
  categories: { count: number; key: string }[];
}

/** 消息项 */
export interface MessageItem {
  id: number | string;
  category: string;
  category_name?: string;
  module_key?: string;
  title: string;
  content?: string;
  date: string;
  isRead?: boolean;
  link?: string;
  query?: Record<string, any>;
  actionText?: string;
  extra_data?: Record<string, any>;
  priority?: number;
  sender_id?: string;
  receiver_id?: string;
  read_at?: null | number;
  created_at?: number;
}

/** 消息列表响应 */
export interface MessageListResponse {
  list: MessageItem[];
  total: number;
}

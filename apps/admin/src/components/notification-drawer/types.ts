/** 通知分类 */
export interface NotificationCategory {
  id: number | string;
  name: string;
  key: string;
  unreadCount?: number;
}

/** 通知项 */
export interface NotificationItem {
  id: number | string;
  /** 分类 key，如 'daily' | 'attendance' | 'approval' */
  category: string;
  /** 标题 */
  title: string;
  /** 内容描述 */
  content?: string;
  /** 时间 */
  date: string;
  /** 是否已读 */
  isRead?: boolean;
  /** 跳转链接（路由 path 或 URL） */
  link?: string;
  query?: Record<string, any>;
  /** 操作按钮文字 */
  actionText?: string;
  [key: string]: any;
}

/** 默认分类列表 */
export const DEFAULT_CATEGORIES: NotificationCategory[] = [
  { id: 1, name: '日常', key: 'daily', unreadCount: 0 },
  { id: 2, name: '考勤打卡', key: 'attendance', unreadCount: 0 },
  { id: 3, name: 'OA审批', key: 'approval', unreadCount: 0 },
];

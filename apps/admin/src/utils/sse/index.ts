/**
 * SSE (Server-Sent Events) 客户端工具
 * 用于接收服务端推送的实时通知未读数
 */

interface SSEOptions {
  /** SSE 端点 URL */
  url?: string;
  /** 接收到消息的回调 */
  onMessage: (event: MessageEvent) => void;
  /** 连接错误的回调 */
  onError?: (error: Event) => void;
  /** 连接关闭的回调 */
  onClose?: () => void;
  /** 连接打开的回调 */
  onOpen?: () => void;
  /** 重连间隔(ms)，默认 5000 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 10 */
  maxReconnectAttempts?: number;
}

export class SSEClient {
  private static instance: null | SSEClient = null;

  /**
   * 是否已连接
   */
  get isConnected(): boolean {
    return this.readyState === EventSource.OPEN;
  }
  /**
   * 是否连接中
   */
  get isConnecting(): boolean {
    return this.readyState === EventSource.CONNECTING;
  }
  /**
   * 获取当前连接状态
   */
  get readyState(): null | number {
    return this.eventSource?.readyState ?? null;
  }
  private eventSource: EventSource | null = null;
  private isManuallyClosed: boolean = false;
  private maxReconnectAttempts: number;
  private onClose?: () => void;

  private onError?: (error: Event) => void;
  private onMessage: (event: MessageEvent) => void;
  private onOpen?: () => void;
  private reconnectAttempts: number = 0;

  private reconnectInterval: number;

  private reconnectTimer: NodeJS.Timeout | null = null;

  private url: string;

  private constructor(options: SSEOptions) {
    // 构建完整的 SSE URL
    const baseURL = import.meta.env.VITE_APP_API_URL || '';
    this.url = options.url || `${baseURL}/adminapi/notification/sse`;
    this.onMessage = options.onMessage;
    this.onError = options.onError;
    this.onClose = options.onClose;
    this.onOpen = options.onOpen;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
  }

  /**
   * 获取单例实例
   */
  static getInstance(options: SSEOptions): SSEClient {
    if (SSEClient.instance) {
      // 更新消息处理器
      SSEClient.instance.onMessage = options.onMessage;
      SSEClient.instance.onError = options.onError;
      SSEClient.instance.onClose = options.onClose;
      SSEClient.instance.onOpen = options.onOpen;

      // 如果 URL 变化，重新连接
      if (options.url && SSEClient.instance.url !== options.url) {
        SSEClient.instance.url = options.url;
        SSEClient.instance.reconnectAttempts = 0;
        SSEClient.instance.connect();
      }
    } else {
      SSEClient.instance = new SSEClient(options);
    }
    return SSEClient.instance;
  }

  /**
   * 建立 SSE 连接
   */
  connect(): void {
    if (this.eventSource) {
      this.disconnect();
    }

    this.isManuallyClosed = false;

    try {
      // 构建完整的 URL（包含认证 token）
      const token = this.getToken();
      const url = token
        ? `${this.url}?token=${encodeURIComponent(token)}`
        : this.url;

      this.eventSource = new EventSource(url, {
        withCredentials: true, // 携带 Cookie（用于 JWT 认证）
      });

      this.eventSource.addEventListener('open', () => {
        console.warn('[SSE] 连接成功:', this.url);
        this.reconnectAttempts = 0;
        this.onOpen?.();
      });

      this.eventSource.addEventListener('message', (event) => {
        this.onMessage(event);
      });

      // 监听自定义事件（unread_count）
      this.eventSource.addEventListener('unread_count', (event) => {
        this.onMessage(event);
      });

      this.eventSource.addEventListener('error', (error) => {
        console.error('[SSE] 连接错误:', error);
        this.onError?.(error);
        this.handleReconnect();
      });
    } catch (error) {
      console.error('[SSE] 初始化失败:', error);
      this.handleReconnect();
    }
  }

  /**
   * 断开 SSE 连接
   */
  disconnect(): void {
    this.isManuallyClosed = true;
    this.clearReconnectTimer();

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.warn('[SSE] 连接已关闭');
      this.onClose?.();
    }
  }

  /**
   * 清除重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 获取 JWT Token
   */
  private getToken(): null | string {
    // 从 localStorage 或 sessionStorage 获取 token
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');
    return token ? `Bearer ${token}` : null;
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect(): void {
    if (this.isManuallyClosed) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`[SSE] 已达到最大重连次数 (${this.maxReconnectAttempts})`);
      return;
    }

    this.reconnectAttempts++;
    console.warn(
      `[SSE] ${this.reconnectInterval}ms 后进行第 ${this.reconnectAttempts} 次重连...`,
    );

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
}

/**
 * 创建 SSE 客户端实例
 */
export function createSSEClient(options: SSEOptions): SSEClient {
  return SSEClient.getInstance(options);
}

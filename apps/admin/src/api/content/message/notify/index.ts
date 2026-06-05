import { requestClient } from '#/api/request';

const base = '/content/message/notify';

export const MessageNotifyApi = {
  getList: (params: any) => requestClient.get(`${base}`, { params }),
  getDetail: (id: number | string) => requestClient.get(`${base}/${id}`),
  markRead: (id: number | string) => requestClient.put(`${base}/${id}/read`),
  batchMarkRead: (ids: (number | string)[]) =>
    requestClient.put(`${base}/batch-read`, { ids }),
  markAllRead: () => requestClient.put(`${base}/read-all`),
  delete: (id: number | string) => requestClient.delete(`${base}/${id}`),
  batchDelete: (ids: (number | string)[]) =>
    requestClient.delete(`${base}/batch-delete`, { data: { ids } }),
  getUnreadCount: () => requestClient.get(`${base}/unread-count`),
};

export const MessageCategoryApi = {
  getAll: () => requestClient.get(`${base}/category/list`),
  getModules: (key: string) =>
    requestClient.get(`${base}/category/${key}/modules`),
};

export const MessageSubscribeApi = {
  getMine: () => requestClient.get(`${base}/subscribe`),
  batchSet: (settings: any[]) =>
    requestClient.post(`${base}/subscribe/batch-set`, { settings }),
  init: () => requestClient.post(`${base}/subscribe/init`),
};

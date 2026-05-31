import { requestClient } from '../request';

const base = '/notification';

export const NotificationApi = {
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

export const NotificationCategoryApi = {
  getAll: () => requestClient.get(`${base}/category/list`),
  getModules: (key: string) =>
    requestClient.get(`${base}/category/${key}/modules`),
  create: (data: any) => requestClient.post(`${base}/category`, data),
  update: (id: number | string, data: any) =>
    requestClient.put(`${base}/category/${id}`, data),
  delete: (id: number | string) =>
    requestClient.delete(`${base}/category/${id}`),
};

export const NotificationSubscribeApi = {
  getMine: () => requestClient.get(`${base}/subscribe`),
  set: (data: any) => requestClient.put(`${base}/subscribe/set`, data),
  batchSet: (settings: any[]) =>
    requestClient.post(`${base}/subscribe/batch-set`, { settings }),
  init: () => requestClient.post(`${base}/subscribe/init`),
};

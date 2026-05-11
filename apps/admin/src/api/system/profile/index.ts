import { requestClient } from '#/api/request'
import type { UpdateAvatarParam, UpdatePasswordParam, UpdateUserInfoParam, UserSession } from './types'

const BASE_URL = '/profile'

export const ProfileService = {
  getProfile() {
    return requestClient.get(BASE_URL)
  },

  updateProfile(data: UpdateUserInfoParam) {
    return requestClient.put(BASE_URL, data)
  },

  updateAvatar(data: UpdateAvatarParam) {
    return requestClient.put(`${BASE_URL}/avatar`, data)
  },

  updatePassword(data: UpdatePasswordParam) {
    return requestClient.put(`${BASE_URL}/password`, data)
  },

  getOnlineDevices(params?: Record<string, any>): Promise<UserSession> {
    return requestClient.get(`${BASE_URL}/sessions`, { params })
  },

  kickoutSession(id: string | number, data?: Record<string, any>): Promise<any> {
    return requestClient.delete(`${BASE_URL}/sessions/${id}`, { data })
  },

  updatePreferences(preferences: Record<string, any>) {
    return requestClient.put(`${BASE_URL}/update-preferences`, { preferences })
  },
}

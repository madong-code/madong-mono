import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import { getUserInfoApi, loginApi, logoutApi } from '#/api';
import { destroyMenuBadgePush } from '#/hooks/use-menu-badge-push';
import { useMenuBadgeStore } from '#/store/modules/menu-badge';
import { useSiteConfigStore } from '#/store/modules/site-config';
import { stopBadgeApplier } from '#/utils/menu-badge-applier';
import { destroyPushClient } from '#/utils/push/client';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    try {
      loginLoading.value = true;
      const { access_token: accessToken, refresh_token: refreshToken } =
        await loginApi(params);

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 和 refreshToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        // 登录成功后重新拉取站点配置，覆盖登录页使用的平台配置（Logo/标题/Favicon）
        // 必须在进入主布局前完成，否则会短暂展示登录页的平台品牌
        try {
          await useSiteConfigStore().syncTenantPreferences();
        } catch {
          // 站点配置同步失败不阻塞登录
        }

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(preferences.app.defaultHomePath);
        }
      }
    } finally {
      loginLoading.value = false;
    }
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }

    // 0. 销毁 WS 连接与徽标订阅（须在 resetAllStores 前，避免残留订阅）
    destroyMenuBadgePush();
    stopBadgeApplier();
    destroyPushClient();
    useMenuBadgeStore().clearAll();

    // 1. 重置所有 store（access/user/siteConfig/tabbar...）
    resetAllStores();

    // 2. 强制清除 token 并写入 storage，防止 persist 插件恢复旧 token
    accessStore.$patch({
      accessToken: null,
      refreshToken: null,
      tenantId: null,
    });

    // 3. 回登录页
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});

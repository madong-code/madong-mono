import type { Recordable, UserInfo } from '@vben/types';

import type { AuthApi } from '#/api/core/auth';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';

import {
  getAccessCodesApi,
  getUserInfoApi,
  getUserTenantListApi,
  loginApi,
  logoutApi,
  switchTenantApi,
} from '#/api';
import { $t } from '#/locales';
import { resetRoutes as resetRouterRoutes } from '#/router';
import { generateAccess } from '#/router/access';
import { accessRoutes } from '#/router/routes';
import { useSiteConfigStore } from '#/store/modules/site-config';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);
  const tenantList = ref<AuthApi.TenantOption[]>([]);
  const tenantListLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const loginResult = await loginApi(params);
      const { access_token: accessToken, refresh_token: refreshToken } =
        loginResult;

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 和 refreshToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);
        // 存储租户ID（多租户模式）
        if (params.tenant_id) {
          accessStore.setTenantId(params.tenant_id);
        }

        // 获取用户信息并存储到 accessStore 中
        const [fetchUserInfoResult, accessCodes] = await Promise.all([
          fetchUserInfo(),
          getAccessCodesApi(),
        ]);

        userInfo = fetchUserInfoResult;

        // 后端 getUserInfo 不返回 current_tenant，从登录响应中注入
        if (loginResult.tenant) {
          (userInfo as Record<string, any>).current_tenant = loginResult.tenant;
        }
        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(accessCodes);

        // 登录成功后获取租户配置并同步到 preferences（logo/标题/favicon）
        const siteConfigStore = useSiteConfigStore();
        await siteConfigStore.syncTenantPreferences();

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.realName) {
          ElNotification({
            message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            title: $t('authentication.loginSuccess'),
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }

    // 1. 重置所有 store（access/user/siteConfig/tabbar...），siteConfig.$reset 已包含 clearTenantConfig
    resetAllStores();

    // 2. 强制清除 token 并写入 storage，防止 pinia-plugin-persistedstate 在 $reset 后恢复旧 token
    accessStore.$patch({
      accessToken: null,
      refreshToken: null,
      tenantId: null,
    });

    // 3. 回登录页（路由守卫检测 accessToken 为空 → 放行）
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

  /**
   * 获取当前用户的租户列表（已登录状态下的租户切换）
   */
  async function fetchTenantList() {
    tenantListLoading.value = true;
    try {
      tenantList.value = await getUserTenantListApi();
      return tenantList.value;
    } finally {
      tenantListLoading.value = false;
    }
  }

  /**
   * 切换当前租户
   * @param tenantId 目标租户ID
   */
  async function switchTenant(tenantId: number | string): Promise<void> {
    const result = await switchTenantApi(tenantId);

    // 更新 token
    accessStore.setAccessToken(result.access_token);
    accessStore.setRefreshToken(result.refresh_token);
    accessStore.setTenantId(String(tenantId));

    // 重新加载用户信息和权限（新租户上下文）
    const [userInfo, accessCodes] = await Promise.all([
      fetchUserInfo(),
      getAccessCodesApi(),
    ]);

    // 后端 getUserInfo 不返回 current_tenant，从切换响应中注入
    if (result.tenant) {
      (userInfo as Record<string, any>).current_tenant = result.tenant;
    }
    userStore.setUserInfo(userInfo);
    accessStore.setAccessCodes(accessCodes);

    // 切换后重新获取租户配置并同步到 preferences（logo/标题/favicon）
    const siteConfigStore = useSiteConfigStore();
    await siteConfigStore.syncTenantPreferences();

    // 重置路由后重新生成新租户的菜单和路由
    resetRouterRoutes();

    const userRoles = userInfo.roles ?? [];
    const { accessibleMenus, accessibleRoutes: newAccessRoutes } =
      await generateAccess({
        roles: userRoles,
        router,
        routes: accessRoutes,
      });

    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(newAccessRoutes);
  }

  function $reset() {
    loginLoading.value = false;
    tenantList.value = [];
  }

  return {
    $reset,
    authLogin,
    fetchTenantList,
    fetchUserInfo,
    loginLoading,
    logout,
    switchTenant,
    tenantList,
    tenantListLoading,
  };
});

import { ref } from 'vue';

// src/store/modules/site-config.ts
import { defineStore } from 'pinia';

import { getSiteInfoApi } from '#/api';
import { ConfigService } from '#/api/system/config';
import { buildStaticUrl } from '#/utils/url';
import { prefetchSignedUrls } from '#/utils/url/private-storage';

// 定义站点配置接口（平台配置 + 租户配置共用）
// 平台配置：从 /login/site-info 获取，code='site_setting_platform'
// 租户配置：从 /system/config/code/site_setting 获取
// 两者字段完全一致，只是内容不同
interface SystemConfig {
  logo?: string; // 站点Logo（来自后端 site_logo）
  title?: string; // 站点名称（来自后端 site_name）
  favicon?: string; // 站点图标（来自后端 site_favicon）
  copyright?: string; // 版权信息（来自后端 site_copyright）
  static_url?: string; // 静态资源base URL（CDN配置）
  cdnUrl?: string; // 兼容旧版CDN URL
  cdnUrlParams?: string; // CDN URL参数
  site_open?: number;
  site_url?: string;
  site_description?: string;
  site_record_no?: string;
  site_icp_url?: string;
  site_network_security?: string;
  site_network_security_url?: string;
  [key: string]: any; // 保留后端原始字段
}

/**
 * 站点配置映射函数
 * 将后端 snake_case 字段映射为前端 camelCase
 * 平台和租户共用同一个映射，只是数据源不同
 */
function mapSiteConfig(source: Record<string, any>): SystemConfig {
  return {
    logo: source?.site_logo || '',
    title: source?.site_name || '',
    // 未单独配置 favicon 时回退使用 logo，保证配置 logo 后浏览器标签页图标跟随
    favicon: source?.site_favicon || source?.site_logo || '',
    copyright: source?.site_copyright || '',
    site_open: source?.site_open,
    site_url: source?.site_url,
    site_description: source?.site_description,
    site_record_no: source?.site_record_no,
    site_icp_url: source?.site_icp_url,
    site_network_security: source?.site_network_security,
    site_network_security_url: source?.site_network_security_url,
    // 保留其他所有字段（如 static_url, cdnUrl, cdnUrlParams 等）
    ...source,
  };
}

/**
 * 站点配置状态管理
 *
 * 双状态设计：
 * - platformConfig：登录前获取的平台级配置（持久存在，退出不清空）
 * - tenantConfig：登录后获取的租户级配置（退出时清空）
 */
export const useSiteConfigStore = defineStore('siteConfig', () => {
  // ==================== 状态 ====================

  // ── 登录前：平台级配置 ──
  const platformConfig = ref<SystemConfig>({});
  const platformLoading = ref(false);
  const platformIsLoaded = ref(false);
  const platformError = ref<null | string>(null);

  // ── 登录后：租户级配置 ──
  const tenantConfig = ref<SystemConfig>({});
  const tenantLoading = ref(false);
  const tenantIsLoaded = ref(false);
  const tenantError = ref<null | string>(null);

  // ==================== Actions ====================

  /**
   * 获取平台级配置（登录前，不需要 Token）
   * GET /login/site-info → 后端查 code='site_setting_platform' 的平台配置
   */
  const fetchPlatformConfig = async () => {
    if (platformLoading.value) return;
    platformLoading.value = true;
    platformError.value = null;

    try {
      const response = (await getSiteInfoApi()) as any;
      platformConfig.value = mapSiteConfig(response as any);
      platformIsLoaded.value = true;

      // 缓存到 localStorage，供 loading.html 在下次启动时读取
      // 有配置值才缓存，无则不存（loading.html 读取不到就不会设置，保留硬编码 fallback）
      try {
        const primaryColor =
          platformConfig.value.primaryColor ||
          platformConfig.value.site_primary_color ||
          platformConfig.value.primary_color;
        const cacheData: Record<string, any> = {
          title: platformConfig.value.title,
          logo: platformConfig.value.logo,
          favicon: platformConfig.value.favicon,
        };
        if (primaryColor) {
          cacheData.primaryColor = primaryColor;
        }
        localStorage.setItem('__site_config__', JSON.stringify(cacheData));
      } catch {
        // 忽略缓存写入失败
      }
    } catch (error: any) {
      platformError.value = error.message || '获取站点信息失败';
      console.warn('获取平台配置失败（不影响登录）:', error);
    } finally {
      platformLoading.value = false;
    }
  };

  /**
   * 获取租户级配置（登录后）
   * GET /system/config/code/site_setting
   * 平台端使用 group_code='platform' 与 admin 端隔离
   */
  const fetchTenantConfig = async (
    code = 'site_setting',
    groupCode = 'platform',
  ) => {
    if (tenantLoading.value) return;
    tenantLoading.value = true;
    tenantError.value = null;

    try {
      const response = (await ConfigService.getByCode(code, {
        group_code: groupCode,
      })) as any;
      tenantConfig.value = mapSiteConfig(response as any);
      tenantIsLoaded.value = true;
    } catch (error: any) {
      tenantError.value = error.message || '获取系统配置失败';
      console.error('获取租户配置失败:', error);
    } finally {
      tenantLoading.value = false;
    }
  };

  /**
   * 清空租户配置（退出登录时调用）
   * 不影响 platformConfig（登录页复用平台品牌）
   */
  const clearTenantConfig = () => {
    tenantConfig.value = {};
    tenantLoading.value = false;
    tenantError.value = null;
    tenantIsLoaded.value = false;
  };

  /**
   * 重置所有配置
   */
  const resetConfig = () => {
    tenantConfig.value = {};
    tenantError.value = null;
    tenantIsLoaded.value = false;
    platformConfig.value = {};
    platformError.value = null;
    platformIsLoaded.value = false;
    // 清理内存后，同时清除 localStorage 缓存
    try {
      localStorage.removeItem('__site_config__');
    } catch {
      // 忽略清理失败
    }
  };

  // resetAllStores() 依赖 $reset()，setup 语法 store 需要手动实现
  const $reset = resetConfig;

  /**
   * 获取当前有效配置（优先租户，回退平台）
   * @deprecated 品牌（logo/favicon）选择应使用 getBrandConfig，避免「有 logo 无站点名」时回退不一致
   */
  const getCurrentConfig = (): SystemConfig => {
    if (tenantIsLoaded.value && tenantConfig.value.title) {
      return tenantConfig.value;
    }
    if (platformIsLoaded.value && platformConfig.value.title) {
      return platformConfig.value;
    }
    return tenantConfig.value;
  };

  /**
   * 统一的品牌配置选择逻辑：
   * - logo/favicon 取「已配置 logo 的一方」（租户优先，回退平台）；
   *   不能用 getCurrentConfig()：它要求租户配置存在 site_name，否则整体回退平台配置，
   *   导致租户只配置了 Logo、未配置站点名称时品牌信息被平台配置覆盖。
   * - 站点名称取租户/平台各自兜底。
   * syncTenantPreferences 与 app.vue 的 watch 共用，避免两端取到不同配置而反复切换图标。
   */
  const getBrandConfig = (): SystemConfig => {
    const storage = tenantConfig.value.logo
      ? tenantConfig.value
      : platformConfig.value;
    const title = tenantConfig.value.title || platformConfig.value.title;
    return { ...storage, title: storage.title || title };
  };

  /**
   * 更新浏览器标签页图标，仅在地址真正变化时赋值，避免重复写入造成闪烁
   */
  const setFaviconHref = (url: string) => {
    if (!url) return;
    const linkEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (linkEl && linkEl.href !== url) {
      linkEl.href = url;
    }
  };

  /**
   * 获取租户配置并同步到 preferences（logo/标题/favicon）
   * 供 settings 保存后、登录后统一调用
   */
  const syncTenantPreferences = async () => {
    await fetchTenantConfig();
    const brand = getBrandConfig();
    const title = brand.title;
    if (!title && !brand.logo) {
      return; // 无可用配置，跳过同步
    }
    const { updatePreferences } = await import('@vben/preferences');
    const updates: Record<string, any> = {};
    if (title) updates.app = { name: title };
    // 私有空间下 logo/favicon 需先向后台换取签名地址，再写入 preferences（一次性写入，无法后续重算）
    await prefetchSignedUrls([brand.logo, brand.favicon]);
    // buildStaticUrl 已含私有分支：私有空间返回签名地址，公开空间按 cdn_url / static_url 拼接，
    // 不能只处理私有场景，否则公开空间的相对 key 会被当作站点同域路径而 404
    const logoUrl = buildStaticUrl(brand.logo || '');
    // logo 有空/有值都更新：空时回退到本地默认 /logo.png，防止 preferences 残留旧值
    updates.logo = {
      source: logoUrl || '/logo.png',
      sourceDark: logoUrl || '/logo.png',
    };
    updatePreferences(updates);
    if (brand.favicon) {
      setFaviconHref(buildStaticUrl(brand.favicon));
    }
  };

  return {
    platformConfig,
    platformLoading,
    platformIsLoaded,
    platformError,
    tenantConfig,
    tenantLoading,
    tenantIsLoaded,
    tenantError,
    fetchPlatformConfig,
    fetchTenantConfig,
    clearTenantConfig,
    resetConfig,
    getCurrentConfig,
    getBrandConfig,
    syncTenantPreferences,
    $reset,
  };
});

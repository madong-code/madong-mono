/**
 * VForm3 懒加载 composable
 *
 * 使用重新构建的 UMD 产物（var 声明，无顶层 const 冲突）。
 * 通过 <script src> 以经典脚本方式加载，UMD 在浏览器全局执行一次。
 *
 * 防重入设计：
 * - 模块级 loaded 标志 + loadingPromise
 * - 检查 globalThis.VFormDesigner 跳过已加载
 */

import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import * as Vue from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 模块级共享状态，跨组件实例共享，防止重复加载
let loaded = false;
let loadingPromise: Promise<void> | null = null;

export function useVForm() {
  const isReady = ref(false);
  const error = ref<string | null>(null);

  onBeforeMount(async () => {
    if (isReady.value || loaded) return;

    try {
      const instance = getCurrentInstance();
      if (!instance?.appContext?.app) return;

      const app = instance.appContext.app;

      if (!loadingPromise) {
        loadingPromise = (async () => {
          // 1. 注册 Element Plus（VForm3 内部依赖）
          const { default: ElementPlus } = await import('element-plus');
          app.use(ElementPlus);
          await import('element-plus/dist/index.css').catch(() => {});

          // 2. 设置 UMD 需要的全局变量
          (globalThis as any).Vue = Vue;
          (globalThis as any).ElementPlusIconsVue = ElementPlusIconsVue;

          // 3. 加载 VForm3 样式
          await import('../designer.style.css');

          // 4. 动态加载 UMD
          if (!(globalThis as any).VFormDesigner) {
            const umdUrl = new URL('../designer.umd.js', import.meta.url).href;
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = umdUrl;
              script.onload = () => resolve();
              script.onerror = () =>
                reject(new Error('VForm3 UMD 脚本加载失败'));
              document.head.appendChild(script);
            });
          }

          // 5. 从全局读取 UMD 暴露的模块并注册
          const VFormMod = (globalThis as any).VFormDesigner;
          if (!VFormMod) {
            throw new Error('全局 VFormDesigner 未定义');
          }

          if (typeof VFormMod.install === 'function') {
            app.use(VFormMod);
          } else {
            if (VFormMod.VFormDesigner?.name) {
              app.component(
                VFormMod.VFormDesigner.name,
                VFormMod.VFormDesigner,
              );
            }
            if (VFormMod.VFormRender?.name) {
              app.component(VFormMod.VFormRender.name, VFormMod.VFormRender);
            }
          }
          loaded = true;
        })();
      }

      await loadingPromise;
      isReady.value = true;
    } catch (e) {
      loadingPromise = null;
      const msg = `VForm3 加载失败: ${e instanceof Error ? e.message : e}`;
      console.error(msg, e);
      error.value = msg;
    }
  });

  return { isReady, error };
}

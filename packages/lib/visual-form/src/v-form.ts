/**
 * VForm3 懒加载 composable
 *
 * VForm3 是 UMD 构建产物，通过动态 <script> 标签加载。
 * UMD 文件通过 new URL() 引用，Vite 在 dev/build 下均能正确处理。
 * 仅在访问表单设计器/渲染器页面时触发。
 */

import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import * as Vue from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export function useVForm() {
  const isReady = ref(false);
  const error = ref<string | null>(null);

  onBeforeMount(async () => {
    if (isReady.value) return;

    try {
      const instance = getCurrentInstance();
      if (!instance?.appContext?.app) return;

      const app = instance.appContext.app;

      // 1. 注册 Element Plus（VForm3 内部依赖）
      const { default: ElementPlus } = await import('element-plus');
      app.use(ElementPlus);
      await import('element-plus/dist/index.css').catch(() => {});

      // 2. 设置 UMD 需要的全局变量
      (globalThis as any).Vue = Vue;
      (globalThis as any).ElementPlusIconsVue = ElementPlusIconsVue;

      // 3. 动态加载 UMD（new URL 由 Vite 处理，dev 直接 serve / build 复制到 dist）
      const umdUrl = new URL('../designer.umd.js', import.meta.url).href;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = umdUrl;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('VForm3 UMD 脚本加载失败'));
        document.head.appendChild(script);
      });

      // 4. 加载 VForm3 样式
      const cssUrl = new URL('../designer.style.css', import.meta.url).href;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);

      // 5. 从全局读取 UMD 暴露的模块并注册
      const VFormMod = (globalThis as any).VFormDesigner;
      if (!VFormMod) {
        throw new Error('全局 VFormDesigner 未定义');
      }

      if (typeof VFormMod.install === 'function') {
        app.use(VFormMod);
      } else {
        if (VFormMod.VFormDesigner?.name) {
          app.component(VFormMod.VFormDesigner.name, VFormMod.VFormDesigner);
        }
        if (VFormMod.VFormRender?.name) {
          app.component(VFormMod.VFormRender.name, VFormMod.VFormRender);
        }
      }

      isReady.value = true;
    } catch (e) {
      const msg = `VForm3 加载失败: ${e instanceof Error ? e.message : e}`;
      console.error(msg, e);
      error.value = msg;
    }
  });

  return { isReady, error };
}

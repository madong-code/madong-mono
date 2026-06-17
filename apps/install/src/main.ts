import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';

import App from './App.vue';
import { getConfig, initConfig } from './utils/config';

import 'element-plus/dist/index.css';

function setDocumentTitle(title?: string) {
  const defaultTitle = 'Madong SaaS 安装向导';
  const config = getConfig();
  const finalTitle = title || config.installInfo?.title || defaultTitle;
  document.title = finalTitle;

  const titleElement = document.querySelector('#dynamic-title');
  if (titleElement) {
    titleElement.textContent = finalTitle;
  }
}

async function bootstrap() {
  await initConfig();
  setDocumentTitle();

  const app = createApp(App);
  const pinia = createPinia();

  app.use(ElementPlus);
  app.use(pinia);
  app.mount('#app');
}

bootstrap().catch(console.error);

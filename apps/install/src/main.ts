import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { initConfig, getConfig } from './utils/config'

function setDocumentTitle(title?: string) {
  const defaultTitle = 'MD-Admin 安装向导'
  const config = getConfig()
  const finalTitle = title || config.installInfo?.title || defaultTitle
  document.title = finalTitle

  const titleElement = document.getElementById('dynamic-title')
  if (titleElement) {
    titleElement.textContent = finalTitle
  }
}

async function bootstrap() {
  await initConfig()
  setDocumentTitle()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(ElementPlus)
  app.use(pinia)
  app.mount('#app')
}

bootstrap().catch(console.error)

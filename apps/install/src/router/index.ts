import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const routes = [
  {
    path: '/',
    component: App,
    meta: { title: 'Madong 安装向导' }
  },
  {
    path: '/install',
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 检查安装状态
router.beforeEach((_to, _from, next) => {
  // 这里可以添加安装状态检查逻辑
  // 如果已经安装完成，可以重定向到其他页面
  next()
})

export default router

import { createRouter, createWebHistory,  } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  // 可以在这里添加更多路由
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导出路由
export default router
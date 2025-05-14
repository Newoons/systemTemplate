import { createRouter, createWebHistory, } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home/index.vue'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: "登录",
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: "/homeWelcome",
    children: [
      {
        path: '/homeWelcome',
        name: 'homeWelcome',
        component: () => import('@/views/home/homeWelcome.vue'),
        meta: {
          title: "首页",
        },
      }
    ]
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
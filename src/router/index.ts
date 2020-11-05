import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/layout/index.vue'),
    redirect: { name: 'role' },
    children: [
      // {
      //   path: '',
      //   name: 'home',
      //   component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
      //   meta: {
      //     requiresAuth: true
      //   }
      // },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */ '@/views/role/index.vue'),
        meta: {
          title: '角色列表',
          requiresAuth: true
        }
      },
      {
        path: '/alloc-menu',
        name: 'alloc-menu',
        props: true,
        component: () => import(/* webpackChunkName: "alloc-menu" */ '@/views/role/alloc-menu/index.vue'),
        meta: {
          title: '角色菜单管理',
          requiresAuth: true
        }
      },
      {
        path: '/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: "alloc-resource" */ '@/views/role/alloc-resource/index.vue'),
        meta: {
          title: '角色资源管理',
          requiresAuth: true
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu" */ '@/views/menu/index.vue'),
        meta: {
          title: '菜单列表',
          requiresAuth: true
        }
      },
      {
        path: '/create-menu',
        name: 'create-menu',
        component: () => import(/* webpackChunkName: "create-menu" */ '@/views/menu/create/index.vue'),
        meta: {
          title: '添加菜单',
          requiresAuth: true
        }
      },
      {
        path: '/edit-menu/:id',
        name: 'edit-menu',
        component: () => import(/* webpackChunkName: "edit-menu" */ '@/views/menu/edit/index.vue'),
        props: true,
        meta: {
          title: '编辑菜单',
          requiresAuth: true
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: "resource" */ '@/views/resource/index.vue'),
        meta: {
          title: '资源列表',
          requiresAuth: true
        }
      },
      {
        path: '/rs-category',
        name: 'rs-category',
        component: () => import(/* webpackChunkName: "rs-category" */ '@/views/resource/category/index.vue'),
        meta: {
          title: '资源分类',
          requiresAuth: true
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: "course" */ '@/views/course/index.vue'),
        meta: {
          title: '课程管理',
          requiresAuth: true
        }
      },
      {
        path: '/new-course',
        name: 'new-course',
        component: () => import(/* webpackChunkName: "new-course" */ '@/views/course/create/index.vue'),
        meta: {
          title: '新增课程',
          requiresAuth: true
        }
      },
      {
        path: '/edit-course/:id',
        name: 'edit-course',
        props: true,
        component: () => import(/* webpackChunkName: "edit-course" */ '@/views/course/edit/index.vue'),
        meta: {
          title: '编辑课程',
          requiresAuth: true
        }
      },
      {
        path: '/sections-course/:id',
        name: 'sections-course',
        props: true,
        component: () => import(/* webpackChunkName: "sections-course" */ '@/views/course/sections/index.vue'),
        meta: {
          title: '内容编辑',
          requiresAuth: true
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: "advert" */ '@/views/advert/index.vue'),
        meta: {
          title: '广告列表',
          requiresAuth: true
        }
      },
      {
        path: '/create-advert',
        name: 'create-advert',
        component: () => import(/* webpackChunkName: "create-advert" */ '@/views/advert/create/index.vue'),
        meta: {
          title: '添加广告',
          requiresAuth: true
        }
      },
      {
        path: '/edit-advert/:id',
        name: 'edit-advert',
        props: true,
        component: () => import(/* webpackChunkName: "edit-advert" */ '@/views/advert/edit/index.vue'),
        meta: {
          title: '编辑广告',
          requiresAuth: true
        }
      },
      {
        path: '/advert-space',
        name: 'advertSpace',
        component: () => import(/* webpackChunkName: "advert-space" */ '@/views/advert-space/index.vue'),
        meta: {
          title: '广告位列表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.beforeEach((to, from: any, next: Function) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (Cookies.getJSON('auth')) {
      next() // 允许通过
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    if (to.fullPath === '/login' && Cookies.getJSON('auth')) {
      next({ path: '/role' })
    } else {
      next() // 确保一定要调用 next()
    }
  }
})

export default router

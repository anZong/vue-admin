import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  }, {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }, {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      title: '个人中心',
      icon: 'user'
    },
    children: [{
      path: 'index',
      name: 'Profile',
      component: () => import('@/views/profile/index'),
      meta: { title: '个人信息' }
    }, {
      path: 'password',
      name: 'Password',
      component: () => import('@/views/profile/password'),
      meta: { title: '修改密码' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    alwaysShow: true, // will always show the root menu
    name: 'User',
    meta: {
      title: '后台用户管理',
      icon: 'admin',
      permissions: ['user']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/model/list'),
        name: 'UserIndex',
        meta: {
          title: '用户列表',
          cacheName: 'ModelList',
          app_label: 'user',
          modelname: 'User',
          editPage: '/user/:id',
          permissions: ['user']
        }
      }, {
        path: 'role',
        component: () => import('@/views/model/list'),
        name: 'Role',
        meta: {
          title: '角色管理',
          cacheName: 'ModelList',
          permissions: ['role'],
          app_label: 'user',
          modelname: 'Role',
          editPage: '/role/:id',
        }
      }, {
        path: 'permission',
        component: () => import('@/views/user/permission'),
        name: 'RolePermission',
        meta: {
          title: '角色权限',
          permissions: ['look_permissions']
        }
      }, {
        path: '/user/:id',
        component: () => import('@/views/model/edit'),
        name: 'EditUser',
        hidden: true,
        meta: {
          verbose_name: '后台用户',
          cacheName: 'EditModel',
          app_label: 'user',
          modelname: 'User',
          listPage: 'UserIndex',
        }
      }, {
        path: '/role/:id',
        component: () => import('@/views/model/edit'),
        name: 'EditXRole',
        hidden: true,
        meta: {
          verbose_name: '后台角色',
          cacheName: 'EditModel',
          app_label: 'user',
          modelname: 'Role',
          listPage: 'Role',
        }
      }
    ]
  }, {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404'
  }]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

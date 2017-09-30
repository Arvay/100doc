import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

/* login */
const Login = _import('login/index')

/* dashboard */
const dashboard = _import('dashboard/index')
const perfect = _import('perfect/index')
/* error page */
const Err404 = _import('404')

/* demo page */
const Form = _import('page/form')
// const Perfect = _import('perfect/index')
const player = _import('player/index')
//demo
const uploadImg = _import('demo/uploadImg')
Vue.use(Router)

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'Example',
    icon: 'zujian',
    children: [
      { path: 'index', component: Form, name: 'Form', icon: 'zonghe' }
    ]
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', component: dashboard, name: '上传视频'}]
  },
  {
    path: '/perfect',
    component: Layout,
    redirect: '/perfect/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', component: perfect, name: '修改信息'}]
  },
  {
    path: '/player',
    component: Layout,
    redirect: '/player/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', component: player, name: '播放'}]
  },
  {
    path: '/uploadImg',
    component: Layout,
    redirect: '/demo/uploadImg',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', component: uploadImg, name: 'demo'}]
  },
  // {
  //   path: '/perfect',
  //   component: Layout,
  //   redirect: '/perfect/index',
  //   icon: 'tubiao',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: Perfect, name: '修改视频信息', meta: { role: ['admin'] }}]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

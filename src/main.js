import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import Cookie from 'js-cookie'
// theme
let theme = Cookie.get('theme') || 'default'
require(`@/styles/themes/${theme}/index.scss`)


import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/router/accessRoutes' // permission control
import './utils/error-log' // error log
// 权限指令
import permission from './components/Permission'
Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to zh_CN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

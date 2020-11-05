import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import ElPaginationWrapper from '@/components/el-pagination-wrapper.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss'

Vue.use(ElementUI)
Vue.use(mavonEditor)

Vue.component('ElPaginationWrapper', ElPaginationWrapper)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Vue.config.errorHandler = (err, vm, info) => {
  // 只在 2.2.0+ 可用
  console.log(err)
}

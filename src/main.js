import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//  所有import 都在上面
import '@/utils/validate.js' // 验证校验相关
// vant 导入
import Vant from 'vant'
// vant 样式导入
import 'vant/lib/index.css'
// res基准值
import 'amfe-flexible/index.min.js'
// 导入全局样式控制文件
import '@/assets/css/global.less'
// 全局注册
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//  所有import 都在上面
import '@/utils/validate.js' // 验证相关
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

Vue.prototype.$sleep = (time) => {
  // Promise对象返回：应用端可以介入await，这样异步过程变为同步过程，可以保证当前代码没有执行完毕，
  // 后续代码不要执行
  return new Promise((resolve) => {
    // setTimeout设置具体延迟
    setTimeout(() => {
      // resolve()是空执行，打酱油的
      resolve()
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

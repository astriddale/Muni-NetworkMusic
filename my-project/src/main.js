import Vue from 'vue'
import App from './App'
import request from './network/request'
import store from './store/index'

Vue.config.productionTip = false
// 将自己封装的request请求放在vue的原型上
Vue.prototype.$request = request;

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
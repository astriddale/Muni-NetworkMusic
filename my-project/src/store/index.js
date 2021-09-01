import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    changeLogin(state, playload) {
      state.isLogin = uni.setStorageSync('isLogin', playload);
    }
  },
  actions: {

  },
  getters: {

  }
})
export default store;
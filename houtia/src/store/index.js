import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  getters,
  state: {
    listTotal: ''
        // 放置公用状态
  },
  actions: {
  },
  mutations: {
        // 写法与getters相类似
        // 组件想要对于vuex 中的数据进行的处理
        // 组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
        // 内部操作必须在此刻完成(同步)
  },
  modules: {
    app,
    user,
    permission
  }
})

export default store

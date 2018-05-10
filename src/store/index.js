import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUserData (state, data) {
      state.user = data
    }
  },
  actions: {
  }
})

export default store

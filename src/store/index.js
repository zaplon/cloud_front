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
    },
    setDoctorTerms (state, start, end) {
      state.user.doctor.terms_start = start
      state.user.doctor.terms_end = end
    }
  },
  actions: {
  }
})

export default store

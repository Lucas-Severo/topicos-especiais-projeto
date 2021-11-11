import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userAuth: {
      
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserAuth(state, userAuth) {
      state.userAuth = userAuth
    },
    logOutUser(state) {
      state.token = ''
      state.userAuth = {}
    }
  },
  actions: {
  },
  modules: {
  }
})

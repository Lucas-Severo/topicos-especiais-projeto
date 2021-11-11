import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userAuth: {
      
    },
    exibirAlerta: false,
    mensagemAlerta: ''
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
    },
    mostrarAlerta(state) {
      state.exibirAlerta = true
      setTimeout(() => {
        state.exibirAlerta = false
      }, 5000)
    },
    esconderAlerta(state) {
      state.exibirAlerta = false
    },
    setMensagemAlerta(state, mensagem) {
      state.mensagemAlerta = mensagem
    }
  },
  actions: {
  },
  modules: {
  }
})

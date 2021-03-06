import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userAuth: {
      
    },
    retratosAgrupadosPorCategoria: {},
    exibirAlerta: false,
    mensagemAlerta: '',
    tipoMensagemAlerta: 'error',
    modalRetrato: {
      mostrarModal: false,
      retrato: {}
    },
    fullScreenImage: {
      mostrarImagemFullScreen: false,
      imagemFullScreen: null
    },
    showLoading: false
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
    },
    setTipoMensagemAlerta(state, tipo) {
      state.tipoMensagemAlerta = tipo
    },

    // Home
    setRetratosAgrupadosPorCategoria(state, retratos) {
      state.retratosAgrupadosPorCategoria = retratos
    },

    // Modal Retrato
    setModalModalRetrato(state, status) {
      state.modalRetrato.mostrarModal = status
    },
    setRetratoModalRetrato(state, retrato) {
      state.modalRetrato.retrato = retrato
    },

    //Imagem FullScreen,
    setMostrarImagemFullScreen(state, status) {
      state.fullScreenImage.mostrarImagemFullScreen = status
    },
    setImagemFullScreen(state, imagem) {
      state.fullScreenImage.imagemFullScreen = imagem
    },

    // Loading
    setShowLoading(state, status) {
      state.showLoading = status
    }
  },
  actions: {
  },
  modules: {
  }
})

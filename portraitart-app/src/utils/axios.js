import axios from 'axios'
import store from '../store'
import ErroMessages from './ErroMessages';

const instance = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:1337'
});

instance.interceptors.request.use((config) => {
    const token = store.state.token;
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    store.commit('mostrarAlerta')
    store.commit('setMensagemAlerta', 'Erro ao realizar a requisição.')
    store.commit('setTipoMensagemAlerta', 'error')
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    return response;
}, function (error) {
    let erroId = error.response.data.message[0].messages[0].id
    let mensagemErro = ErroMessages[erroId]
    if(!mensagemErro) {
        mensagemErro = {mensagem: 'Erro na aplicação.'}
    }

    store.commit('mostrarAlerta')
    store.commit('setMensagemAlerta', mensagemErro.mensagem)
    store.commit('setTipoMensagemAlerta', 'error')
    return Promise.reject(error);
  })

export default instance;
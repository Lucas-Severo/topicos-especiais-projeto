import axios from './axios'

class UsuarioApiRequest {

    async buscarUsuarioPorId(id) {
        return axios.get(`/users/${id}`)
    }

    async atualizarUsuarioPorId(id, data) {
        return axios.put(`/users/${id}`, data)
    }

    async buscarUsuarioPorUserName(userName) {
        return axios.get(`/users?username=${userName}`)
    }

}

export default new UsuarioApiRequest()
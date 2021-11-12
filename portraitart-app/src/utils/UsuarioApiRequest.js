import axios from './axios'

class UsuarioApiRequest {

    async buscarUsuarioPorId(id) {
        return axios.get(`/users/${id}`)
    }

    async buscarUsuarioPorUserName(userName) {
        return axios.get(`/users?username=${userName}`)
    }

}

export default new UsuarioApiRequest()
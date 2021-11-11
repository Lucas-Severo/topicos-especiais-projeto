import axios from './axios'

class UsuarioApiRequest {

    async buscarUsuarioPorId(id) {
        return axios.get(`/users/${id}`)
    }

}

export default new UsuarioApiRequest()
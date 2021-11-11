import axios from './axios'

class AutenticacaoApiRequest {

    async login(data) {
        return axios.post('/auth/local', data)
    }

    async registrar(data) {
        return axios.post('/users', data)
    }

}

export default new AutenticacaoApiRequest()
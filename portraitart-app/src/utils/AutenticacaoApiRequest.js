import axios from './axios'

class AutenticacaoApiRequest {

    async login(data) {
        return axios.post('/auth/local', data)
    }

}

export default new AutenticacaoApiRequest()
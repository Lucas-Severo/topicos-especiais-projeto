import axios from './axios'

class RetratoApiRequest {

    async buscarTodosRetratos() {
        return axios.post('/retratos')
    }

}

export default new RetratoApiRequest()
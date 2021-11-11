import axios from './axios'

class RetratoApiRequest {

    async buscarTodosRetratos() {
        return axios.get('/retratos')
    }

}

export default new RetratoApiRequest()
import axios from './axios'

class RetratoApiRequest {

    async buscarTodosRetratos() {
        return axios.get('/retratos')
    }

    async buscarPorCategoria(categoria, limit) {
        return axios.get(`/retratos?categoria.nome=${categoria}&_limit=${limit}&_sort=created_at:desc`)
    }

    async buscarRetratosUsuarioPaginado(username, page, limit) {
        const start = (page - 1) * limit
        return axios.get(`/retratos?usuario.username=${username}&_start=${start}&_limit=${limit}&_sort=created_at:desc`)
    }

    async countRetratosPorUsuario(username) {
        return axios.get(`/retratos/count?usuario.username=${username}`)
    }

    async salvarRetrato(retrato) {
        return axios.post('/retratos', retrato)
    }

    async atualizarRetrato(retrato) {
        return axios.put(`/retratos/${retrato.id}`, retrato)
    }

    async buscarPorUidEUserName(uid, username) {
        return axios.get(`/retratos?uid=${uid}&usuario.username=${username}`)
    }

}

export default new RetratoApiRequest()
import axios from './axios'

class CategoriaApiRequest {

    async buscarTodos(data) {
        return axios.get('/categorias')
    }

}

export default new CategoriaApiRequest()
import axios from './axios'

class ImageApiRequest {

    async uploadImage(image) {
        const formData = new FormData()
        formData.append('files', image)

        return axios.post('/upload', formData)
    }

}

export default new ImageApiRequest()
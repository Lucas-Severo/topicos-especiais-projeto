class ConfigProvider {

    getBaseUrl() {
        return process.env.baseURL || 'http://localhost:1337'
    }

}

export default new ConfigProvider()
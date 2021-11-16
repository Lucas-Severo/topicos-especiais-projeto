class ConfigProvider {

    getBaseUrl() {
        return process.env.API_URL || 'http://localhost:1337'
    }

}

export default new ConfigProvider()
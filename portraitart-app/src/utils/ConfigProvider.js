class ConfigProvider {

    getBaseUrl() {
        return process.env.BASE_URL || 'http://localhost:1337'
    }

}

export default new ConfigProvider()
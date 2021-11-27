class ConfigProvider {

    getBaseUrl() {
        return process.env.API_URL || 'http://localhost:1337'
    }

    getFileProviderUrl() {
        if (process.env.NODE_ENV === 'production') {
            return ''
        }
        return 'http://localhost:1337'
    }

}

export default new ConfigProvider()
export default {
    methods: {
        obterPrecoSemFormatacao(valor) {
            const objetos = {
                '.': ',',
                ',': '.'
            }
            valor = valor.replace('R$ ', '')
            valor = valor.replace(/.|,/g, function(matched){
                if (matched === '.') {
                    return ''
                } else if (matched === ',') {
                    return '.'
                }
                return matched
            })
            return valor
        }
    }
}
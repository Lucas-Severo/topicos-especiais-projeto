<template>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      @keydown.esc="closeDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Adicionar Retrato

          <v-spacer/>
          <v-icon color="error" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>

        <div class="d-flex flex-column ml-4 mr-4 pb-5">
            <v-form>
                <v-text-field
                    v-model="retrato.titulo"
                    v-validate="'max:50'"
                    :error-messages="errors.collect('titulo')"
                    label="Título"
                    counter="50"
                    name="titulo"/>

                <v-text-field
                    v-model="retrato.preco"
                    v-validate="'required'"
                    class="mb-4"
                    v-mask="currencyMask"
                    maxlength="25"
                    :error-messages="errors.collect('preco')"
                    label="Preço"
                    name="preco"/>

                <ImagePicker
                    v-model="retrato.qualidadeMinima"
                    :profileMode="false"
                    :showDefaultImage="false"
                    :readOnly="false"
                    label="Qualidade Mínima"
                    :required="true"
                    name="qualidadeMinima"
                    :width="500"
                    ref="qualidadeMinima"
                    @showImageFullScreen="showImageFullScreen"
                    @updateImage="atualizarImagemQualidadeMinima"/>

                <ImagePicker
                    v-model="retrato.qualidadeMaxima"
                    :profileMode="false"
                    :showDefaultImage="false"
                    :readOnly="false"
                    label="Qualidade Máxima"
                    :required="true"
                    name="qualidadeMaxima"
                    :error-messages="errors.collect('qualidadeMaxima')"
                    class="mt-5"
                    :width="500"
                    ref="qualidadeMaxima"
                    @showImageFullScreen="showImageFullScreen"
                    @updateImage="atualizarImagemQualidadeMaxima"/>

                <v-btn 
                    @click="adicionarRetrato"
                    color="primary"
                    block
                    class="mt-3">
                    Adicionar
                </v-btn>
            </v-form>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
import ImagePicker from '../components/ImagePicker.vue'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import ImageApiRequest from '../utils/ImageApiRequest'
import RetratoApiRequest from '../utils/RetratoApiRequest'
import store from '../store'

const currencyMask = createNumberMask({
    prefix: 'R$ ',
    allowDecimal: true,
    includeThousandsSeparator: true,
    decimalSymbol: ',',
    thousandsSeparatorSymbol: '.',
    allowNegative: false,
});

export default {
    name: 'ModalAdicionarRetrato',
    props: ['value'],
    components: {
        ImagePicker
    },
    data() {
        return {
            currencyMask,
            dialog: this.value,
            retrato: {
                titulo: '',
                preco: '',
                qualidadeMinima: null,
                qualidadeMaxima: null
            }
        }
    },
    watch: {
        'value'(valor) {
            this.dialog = valor
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog');
        },
        async adicionarRetrato() {
            const primeiraImagem = await this.$refs.qualidadeMaxima.$validator.validateAll()
            const segundaImagem = await this.$refs.qualidadeMinima.$validator.validateAll()
            const camposObrigatoriosPreenchidos = await this.$validator.validateAll()
            
            if( primeiraImagem && segundaImagem && camposObrigatoriosPreenchidos) {
                this.salvarRetrato()    
            }
        },
        atualizarImagemQualidadeMinima(image) {
            this.retrato.qualidadeMinima = image
        },
        atualizarImagemQualidadeMaxima(image) {
            this.retrato.qualidadeMaxima = image
        },
        showImageFullScreen(image) {
            this.$emit('showImageFullScreen', image)
        },
        async salvarRetrato() {
            const {data: qualidadeMinima} = await ImageApiRequest.uploadImage(this.retrato.qualidadeMinima)
            const {data: qualidadeMaxima} = await ImageApiRequest.uploadImage(this.retrato.qualidadeMaxima)

            const precoSemFormatacao = this.obterPrecoSemFormatacao(this.retrato.preco)

            const retrato = {
                imagem_baixa_definicao: qualidadeMinima[0].id,
                imagem_alta_definicao: qualidadeMaxima[0].id,
                usuario: store.state.userAuth.id,
                preco: precoSemFormatacao,
                titulo: this.retrato.titulo
            }

            const {status} = await RetratoApiRequest.salvarRetrato(retrato)
            
            if (status === 200) {
                this.retrato = {
                    titulo: '',
                    preco: 0,
                    qualidadeMinima: null,
                    qualidadeMaxima: null
                }
                this.$store.commit("mostrarAlerta")
                this.$store.commit("setMensagemAlerta", "Retrato adicionado com sucesso!")
                this.$store.commit('setTipoMensagemAlerta', 'success')
            }

            this.closeDialog()
        },
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
</script>

<style scoped lang="stylus">
    
</style>
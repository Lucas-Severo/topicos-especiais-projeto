<template>
    <v-dialog
      v-model="mostrarModal"
      @click:outside="closeDialog"
      @keydown.esc="closeDialog"
      width="800"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Informações Retrato
          <v-spacer/>
          <v-icon color="error" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>

        <div class="d-flex mt-3 ml-5 corpo">
            <div class="image-space">
                <ImagePicker
                    :value="imagemBaixaDefinicao"
                    :readOnly="!ehUsuarioAutenticado"
                    :profileMode="false"
                    class="mr-5"
                    :required="true"
                    :width="400"
                    height="300"
                    @updateImage="atualizarImagemBaixaDefinicao"
                    @showImageFullScreen="showImageFullScreen"/>
            </div>

            <div class="d-flex flex-column justify-around mr-4">
                <v-card-text>
                    <editable-text
                        v-model="retrato.titulo"
                        :key="'titulo'+retrato.id"
                        :required="false"
                        validation="'max:50'"
                        :maxLength="50"
                        :counter="50"
                        label="Título"
                        name="titulo"
                        :readOnly="!ehUsuarioAutenticado"
                        noValueMessage="Sem Título"
                        @updateValue="atualizarTitulo"/>
                    
                    <editable-text
                        v-model="retrato.preco"
                        :key="'preco'+retrato.id"
                        :required="true"
                        validation="'max:35'"
                        class="mt-3"
                        :maxLength="35"
                        label="Preço"
                        name="preco"
                        :currency="true"
                        :readOnly="!ehUsuarioAutenticado"
                        noValueMessage="Sem Preço"
                        @updateValue="atualizarPreco"/>

                    <editable-auto-complete
                        v-model="retrato.categoria"
                        :key="'categoria'+retrato.id"
                        :items="categorias"
                        class="mt-3"
                        :required="true"
                        :readOnly="!ehUsuarioAutenticado"
                        name="categoria"
                        label="Categorias"
                        noValueMessage="Categoria não selecionada"
                        @updateValue="atualizarCategoria"/>
                </v-card-text>
                <v-btn color="primary">Comprar</v-btn>
            </div>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
import ImagePicker from '../components/ImagePicker'
import ImageApiRequest from '../utils/ImageApiRequest'
import RetratoApiRequest from '../utils/RetratoApiRequest'
import CategoriaApiRequest from '../utils/CategoriaApiRequest'
import store from '../store'
import EditableText from './EditableText.vue'
import EditableAutoComplete from './EditableAutoComplete'
import ConfigProvider from '../utils/ConfigProvider'

export default {
    name: 'ModalRetrato',
    components: {
        ImagePicker,
        EditableText,
        EditableAutoComplete,
        EditableAutoComplete
    },
    data() {
        return {
            retrato: store.state.modalRetrato.retrato,
            imagemBaixaDefinicao: null,
            categorias: []
        }
    },
    watch: {
        modalRetrato: {
            handler(value) {
                this.retrato = value.retrato
                this.setImagemBaixaDefinicao()
            },
            deep: true
        },
        '$route.params': {
            async handler(value) {
                if (value.uid) {
                    await this.buscarRetrato(value.uid, value.username)
                }
            }
        }
    },
    async mounted() {
        const uid = this.$route.params.uid
        const username = this.$route.params.username

        if (uid) {
            await this.buscarRetrato(uid, username)
        }

        await this.buscarCategorias()
    },
    computed: {
        ehUsuarioAutenticado() {
            if (!store.state.userAuth || !this.retrato.usuario) return false
            return store.state.userAuth.id === this.retrato.usuario.id
        },
        mostrarModal() {
            return store.state.modalRetrato.mostrarModal
        },
        modalRetrato() {
            return store.state.modalRetrato
        }
    },
    methods: {
        async closeDialog() {
            this.$store.commit('setModalModalRetrato', false)
            await this.redirecionarTelaPerfil()
        },
        async redirecionarTelaPerfil() {
            await this.$router.push({
                name: 'PerfilUsuario',
                params: {
                    username: this.$route.params.username
                }
            })
        },
        obterUrlImagem() {
            if (this.image) {
                return ConfigProvider.getBaseUrl()+this.imagemBaixaDefinicao.url
            }
        },
        setImagemBaixaDefinicao() {
            const imagemBaixaDefinicao = this.retrato.imagem_baixa_definicao
            if (imagemBaixaDefinicao) {
                this.imagemBaixaDefinicao = imagemBaixaDefinicao[0]
            }
        },
        showImageFullScreen(image) {
            this.$store.commit('setMostrarImagemFullScreen', true)
            this.$store.commit('setImagemFullScreen', image)
        },
        async atualizarImagemBaixaDefinicao(imagem) {
            const {data: qualidadeMinima} = await ImageApiRequest.uploadImage(imagem)
            this.retrato.imagem_baixa_definicao = qualidadeMinima

            await this.atualizarRetrato(this.retrato)
        },
        async atualizarTitulo(titulo) {
            this.retrato.titulo = titulo
            await this.atualizarRetrato(this.retrato)
        },
        async atualizarPreco(preco) {
            this.retrato.preco = preco
            await this.atualizarRetrato(this.retrato)
        },
        async atualizarCategoria(categoria) {
            this.retrato.categoria = categoria
            await this.atualizarRetrato(this.retrato)
        },
        async atualizarRetrato(retrato) {
            const {data, status} = await RetratoApiRequest.atualizarRetrato(retrato)
        
            if (status === 200) {
                this.retrato.categoria = data.categoria
                this.mostrarMensagemRetratoAtualizadoComSucesso()
            }
        },
        mostrarMensagemRetratoAtualizadoComSucesso() {
            this.$store.commit("mostrarAlerta")
            this.$store.commit("setMensagemAlerta", "Retrato atualizado com sucesso!")
            this.$store.commit('setTipoMensagemAlerta', 'success')
        },
        mostrarMensagemErro(erro) {
            this.$store.commit("mostrarAlerta")
            this.$store.commit("setMensagemAlerta", erro)
            this.$store.commit('setTipoMensagemAlerta', 'error')
        },
        async buscarRetrato(uid, username) {
            this.$store.commit('setModalModalRetrato', true)
            const {data: retrato} = await RetratoApiRequest.buscarPorUidEUserName(uid, username)
            
            if (retrato.length === 0) {
                this.mostrarMensagemErro("Retrato não encontrado!")
                await this.closeDialog()
            } else {
                this.categoria = retrato[0].categoria.id
                this.$store.commit('setRetratoModalRetrato', retrato[0])
            }
        },
        async buscarCategorias() {
            const {data: categorias} = await CategoriaApiRequest.buscarTodos()
            this.categorias = categorias
        }
    }
}
</script>

<style lang="stylus" scoped>
.corpo
    min-height: 320px
</style>
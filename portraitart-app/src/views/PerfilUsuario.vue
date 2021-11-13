<template>
    <v-container fluid>
        <ModalRetrato 
            v-model="dialog"
            :image="retratoModal"
            @closeDialog="fecharModal"/>
        <ModalAdicionarRetrato
            v-model="dialogAdicionarRetrato"
            @closeDialog="fecharModalAdicionarRetrato"/>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
                <p v-if="!userExists">Usuário Não Encontrado</p>
                <div v-if="userExists" class="d-flex align-center">
                    <ImagePicker
                        :value="getUser.profile_image"
                        :readOnly="!ehUsuarioAutenticado"
                        :profileMode="true"
                        class="mr-5"
                        @updateImage="updateImage"
                        @showImageFullScreen="showImageFullScreen"/>
                    <div>
                        <div class="d-flex">
                            <p class="mr-6"><span>{{user.name}}</span></p>
                            <p class="font-weight-bold h6">{{user.username}}</p>
                        </div>
                        <div class="d-flex align-center">
                            <p>Retratos: {{quantidadeTotal}}</p>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <div class="container mt-10" v-if="userExists">
            <h2 class="mb-3">{{quantidadeTotal}} Retratos</h2>

            <v-btn 
                v-if="ehUsuarioAutenticado"
                @click="abrirModalAdicionarRetrato"
                class="mb-5"
                color="success">Novo Retrato
            </v-btn>

            <div class="text-center">
                <v-pagination
                    v-if="totalPages>0"
                    v-model="page"
                    class="mb-8"
                    :length="totalPages"
                    @input="buscarRetratosUsuario"
                ></v-pagination>
            </div>
            <v-row class="row">
                <ImageHover
                    v-for="retrato in retratos"
                    @click="()=>abrirModalInfoImagem(retrato)"
                    :key="retrato.id"
                    :retrato="retrato"
                    :minHeight="150"
                    :minWidth="250"
                    :maxHeight="150"
                    :maxWidth="250"
                    baseUrl="http://localhost:1337"
                    :image="retrato.imagem_baixa_definicao[0]"
                />
            </v-row>
        </div>

        <v-overlay :value="showFullScreen">
            <v-btn
                class="absolute white--text"
                color="black"
                @click="showFullScreen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-img
                :src="obterImagemFullScreen()"
                max-width="600"
                max-height="600"/>
        </v-overlay>
    </v-container>
</template>

<script>
import UsuarioApiRequest from '../utils/UsuarioApiRequest'
import RetratoApiRequest from '../utils/RetratoApiRequest'
import ImageApiRequest from '../utils/ImageApiRequest'
import ImagePicker from '../components/ImagePicker'
import ImageHover from '../components/ImageHover'
import ModalRetrato from '../components/ModalRetrato'
import ModalAdicionarRetrato from '../components/ModalAdicionarRetrato'
import store from '../store'

export default {
    name: 'PerfilUsuario',
    components: {
        ImagePicker,
        ModalRetrato,
        ModalAdicionarRetrato,
        ImageHover
    },
    data() {
        return {
            username: '',
            userExists: false,
            user: {},
            limit: 12,
            page: 1,
            retratos: [],
            totalPages: 1,
            quantidadeTotal: 0,
            dialog: false,
            dialogAdicionarRetrato: false,
            retratoModal: {},
            imageFullScreen: null,
            showFullScreen: false
        }
    },
    watch: {
        '$route.params': {
            async handler() {
                this.obterUserName()
                await this.verificarDadosUsuario()
                await this.buscarQuantidadeRetratos()
                await this.buscarRetratosUsuario()
            },
            deep: true
        }
    },
    computed: {
        getUser() {
            return this.user
        },
        ehUsuarioAutenticado() {
            return store.state.userAuth.id === this.user.id
        }
    },
    async mounted() {
        this.obterUserName()
        await this.verificarDadosUsuario()
        await this.buscarQuantidadeRetratos()
        await this.buscarRetratosUsuario()
    },
    methods: {
        obterUserName() {
            this.username = this.$route.params.username
        },
        async verificarDadosUsuario() {
            const {data} = await UsuarioApiRequest.buscarUsuarioPorUserName(this.username)
            
            if (data.length > 0) {
                this.userExists = true
                this.user = data[0]
            }
        },
        async updateImage(image) {
            const {data} = await ImageApiRequest.uploadImage(image)

            if (Array.isArray(data) && data.length > 0) {
                const imageId = data[0]
                const usuarioAlteracao = {...this.user}
                usuarioAlteracao.profile_image = imageId
                const response = await UsuarioApiRequest.atualizarUsuarioPorId(usuarioAlteracao.id, usuarioAlteracao)
                this.user = {...response.data}
            }
        },
        async buscarQuantidadeRetratos() {
            const {data: quantidadeTotal} = await RetratoApiRequest.countRetratosPorUsuario(
                this.user.username
            )
            this.quantidadeTotal = quantidadeTotal
        },
        async buscarRetratosUsuario() {
            const {data} = await RetratoApiRequest.buscarRetratosUsuarioPaginado(
                this.user.username,
                this.page,
                this.limit
            )
            this.retratos = data
            this.totalPages = Math.ceil(this.quantidadeTotal / this.limit)
        },
        abrirModalInfoImagem(imagem) {
            this.retratoModal = imagem.imagem_baixa_definicao[0]
            this.dialog = true
        },
        abrirModalAdicionarRetrato() {
            this.dialogAdicionarRetrato = true
        },
        fecharModal() {
            this.dialog = false
        },
        fecharModalAdicionarRetrato() {
            this.dialogAdicionarRetrato = false
        },
        showImageFullScreen(image) {
            this.imageFullScreen = image[0]
            this.showFullScreen = true
        },
        obterImagemFullScreen() {
            if (this.imageFullScreen) {
                return 'http://localhost:1337' + this.imageFullScreen.url
            }
        }
    }
}
</script>

<style scoped lang="stylus">
    .absolute
        position fixed
        top 0
        right 0
        margin 10px
</style>
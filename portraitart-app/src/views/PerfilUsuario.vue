<template>
    <v-container fluid>
        <ModalRetrato/>
        <ModalAdicionarRetrato
            v-model="dialogAdicionarRetrato"
            @closeDialog="fecharModalAdicionarRetrato"
            @showImageFullScreen="showImageFullScreen"/>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
                <p v-if="!userExists">Usuário Não Encontrado</p>
                <div v-if="userExists" class="d-flex align-center">
                    <ImagePicker
                        :value="getUser.profile_image[0]"
                        :readOnly="!ehUsuarioAutenticado"
                        :profileMode="true"
                        class="mr-5"
                        :required="true"
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
                    :baseUrl="baseURL"
                    :image="retrato.imagem_baixa_definicao[0]"
                />
            </v-row>
        </div>

        <FullScreenImage/>
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
import FullScreenImage from '../components/FullScreenImage.vue'
import ConfigProvider from '../utils/ConfigProvider'

export default {
    name: 'PerfilUsuario',
    components: {
        ImagePicker,
        ModalRetrato,
        ModalAdicionarRetrato,
        ImageHover,
        FullScreenImage
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
            dialogAdicionarRetrato: false,
            imageFullScreen: null,
            showFullScreen: false,
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
        },
        baseURL() {
            return ConfigProvider.getBaseUrl()
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
            if (image instanceof File) {
                const {data} = await ImageApiRequest.uploadImage(image)
                if (Array.isArray(data) && data.length > 0) {
                    const imageId = data[0]
                    const usuarioAlteracao = {...this.user}
                    usuarioAlteracao.profile_image = imageId
                    const response = await UsuarioApiRequest.atualizarUsuarioPorId(usuarioAlteracao.id, usuarioAlteracao)
                    this.user = {...response.data}
                }
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
        async abrirModalInfoImagem(retrato) {
            await this.$router.push({
                name: 'ModalRetrato',
                params: {
                    ...this.$route.params,
                    uid: retrato.uid
                }
            })
        },
        abrirModalAdicionarRetrato() {
            this.dialogAdicionarRetrato = true
        },
        fecharModalAdicionarRetrato() {
            this.dialogAdicionarRetrato = false

            this.buscarQuantidadeRetratos()
            this.buscarRetratosUsuario()
        },
        showImageFullScreen(image) {
            this.$store.commit('setMostrarImagemFullScreen', true)
            this.$store.commit('setImagemFullScreen', image)
        }
    }
}
</script>

<style scoped lang="stylus">
</style>
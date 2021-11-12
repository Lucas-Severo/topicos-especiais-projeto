<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
                <p v-if="!userExists">Usuário Não Encontrado</p>
                <div v-if="userExists" class="d-flex align-center">
                    <ImagePicker
                        :value="getUser.profile_image"
                        :readOnly="!ehUsuarioAutenticado"
                        @updateImage="updateImage"/>
                    <div class="d-flex">
                        <div>
                            <p class="mr-6"><span>{{user.name}}</span></p>
                            <div>Retratos: {{quantidadeTotal}}</div>
                        </div>
                        <p class="font-weight-bold h6">{{user.username}}</p>
                    </div>
                </div>
            </v-col>
        </v-row>
        <div class="container mt-10" v-if="userExists">
            <h2 class="mb-3">{{quantidadeTotal}} Retratos</h2>

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
                <v-img
                    v-for="retrato in retratos" 
                    class="col-1 mr-4 mb-2 retrato"
                    :key="retrato.id"
                    :lazy-src="'http://localhost:1337'+retrato.imagem[0].url"
                    min-height="150"
                    min-width="250"
                    max-height="150"
                    max-width="250"
                    :src="'http://localhost:1337'+retrato.imagem[0].url"/>
                <div></div>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import UsuarioApiRequest from '../utils/UsuarioApiRequest'
import RetratoApiRequest from '../utils/RetratoApiRequest'
import ImageApiRequest from '../utils/ImageApiRequest'
import ImagePicker from '../components/ImagePicker'
import store from '../store'

export default {
    name: 'PerfilUsuario',
    components: {
        ImagePicker
    },
    data: () => ({
        username: '',
        userExists: false,
        user: {},
        limit: 12,
        page: 1,
        retratos: [],
        totalPages: 1,
        quantidadeTotal: 0
    }),
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
        }
    }
}
</script>

<style scoped lang="stylus">
    .retrato
        position relative
        cursor pointer

    .retrato:hover::before 
        content: "👁";
        position: absolute
        top 0
        left 0
        display: flex
        justify-content: center
        align-items: center
        background-color #000a
        color white
        width 100%
        height 100%
</style>
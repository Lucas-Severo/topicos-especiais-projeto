<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
                <p v-if="!userExists">Usuário Não Encontrado</p>
                <div v-if="userExists" class="d-flex align-center">
                    <ImagePicker
                        :value="getUser.profile_image"
                        @updateImage="updateImage"/>
                    <div class="d-flex">
                        <div>
                            <p class="mr-6"><span>{{user.name}}</span></p>
                            <div>Retratos: {{user.retratos.length}}</div>
                        </div>
                        <p class="font-weight-bold h6">{{user.username}}</p>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import UsuarioApiRequest from '../utils/UsuarioApiRequest'
import ImageApiRequest from '../utils/ImageApiRequest'
import ImagePicker from '../components/ImagePicker'

export default {
    name: 'PerfilUsuario',
    components: {
        ImagePicker
    },
    data: () => ({
        username: '',
        userExists: false,
        user: {}
    }),
    computed: {
        getUser() {
            return this.user
        }
    },
    async mounted() {
        this.obterUserName()
        await this.verificarDadosUsuario()
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
        }
    }
}
</script>

<style scoped>

</style>
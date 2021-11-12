<template>
    <v-container fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="6">
                <p v-if="!userExists">Usuário Não Encontrado</p>
                <div v-if="userExists" class="d-flex align-center">
                    <div>
                        <v-icon dense size="150">mdi-account</v-icon>
                    </div>
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

export default {
    name: 'PerfilUsuario',
    data: () => ({
        username: '',
        userExists: false,
        user: {}
    }),
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
        }
    }
}
</script>

<style scoped>

</style>
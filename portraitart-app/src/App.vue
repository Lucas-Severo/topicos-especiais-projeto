<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-btn 
          text 
          @click="redirecionarTelaInicial">
          Portrait App <v-icon>mdi-account-box-outline</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <button 
        text
        @click="redirecionarParaPerfilUsuario" 
        class="mr-3">
        {{usuario.username}}
      </button>
      <v-btn
        v-if="usuarioAutenticado"
        text
        @click="deslogarUsuario"
      >
        Sair<v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn
        v-else
        text
        @click="redirecionarTelaLogin"
      >
        Entrar<v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Alerta/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import store from './store'
import AutenticacaoApiRequest from './utils/AutenticacaoApiRequest'
import UsuarioApiRequest from './utils/UsuarioApiRequest'
import Alerta from './components/Alerta.vue'

export default {
  name: 'App',
  components: {
    Alerta
  },
  computed: {
    ehRotaLogin() {
      const rotasAutenticacao = ['Cadastro', 'Login']
      return rotasAutenticacao.includes(this.$route.name)
    },
    usuarioAutenticado() {
      return store.state.token !== ''
    },
    usuario() {
      return store.state.userAuth
    }
  },
  data: () => ({
    
  }),
  async mounted() {
      await this.verificarTokenSalvoSessao()
      await this.verificarUsuarioAutenticado()
  },
  methods: {
    async redirecionarTelaInicial() {
      if (this.$route.name !== 'Home') {
        await this.$router.push({
          name: 'Home'
        })
      }
    },
    async deslogarUsuario() {
      this.$store.commit('logOutUser')
      localStorage.removeItem('token')
      await this.redirecionarTelaLogin()
    },
    async redirecionarTelaLogin() {
      if (this.$route.name !== 'Login') {
        await this.$router.push({
          name: 'Login'
        })
      }
    },
    async verificarUsuarioAutenticado() {
        const rotasAutenticacao = ['Login', 'Cadastro']
        if (rotasAutenticacao.includes(this.$route.name) && store.state.token !== '') {
            await this.$router.push({
                name: 'Home'
            })
        }
    },
    async verificarTokenSalvoSessao() {
        const token = localStorage.getItem('token')
        if (token) {
            this.$store.commit('setToken', token)
            const {data} = await AutenticacaoApiRequest.validateToken({token})
            await this.buscarUsuarioAutenticado(data.id)
        }
    },
    async buscarUsuarioAutenticado(usuarioId) {
      const {data} = await UsuarioApiRequest.buscarUsuarioPorId(usuarioId)
      this.$store.commit('setUserAuth', data)
    },
    async redirecionarParaPerfilUsuario() {
      if (this.$route.name !== 'PerfilUsuario') {
        await this.$router.push({
          name: 'PerfilUsuario',
          params: {
            username: store.state.userAuth.username
          }
        })
      }
    }
  }
}
</script>

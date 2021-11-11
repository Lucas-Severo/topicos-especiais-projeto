<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <button @click="redirecionarTelaInicial">Portrait App</button>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="usuarioAutenticado"
        text
        @click="deslogarUsuario"
      >
        Deslogar
      </v-btn>
      <v-btn
        v-else
        text
        @click="redirecionarTelaLogin"
      >
        Login
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import store from './store'

export default {
  name: 'App',
  computed: {
    ehRotaLogin() {
      const rotasAutenticacao = ['Cadastro', 'Login']
      return rotasAutenticacao.includes(this.$route.name)
    },
    usuarioAutenticado() {
      return store.state.token !== ''
    }
  },
  data: () => ({
    
  }),
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
      await this.redirecionarTelaLogin()
    },
    async redirecionarTelaLogin() {
      if (this.$route.name !== 'Login') {
        await this.$router.push({
          name: 'Login'
        })
      }
    }
  }
}
</script>

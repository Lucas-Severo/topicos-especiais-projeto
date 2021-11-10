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

export default {
  name: 'App',
  computed: {
    ehRotaLogin() {
      const rotasAutenticacao = ['Cadastro', 'Login']
      return rotasAutenticacao.includes(this.$route.name)
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

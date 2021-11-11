<template>
    <v-container fill-height >
        <v-row align="center" justify="center">
            <v-col cols="4">
                <h2 class="text-center">Realizar Login</h2>
                    <div class="mb-10">
                        <v-text-field
                            v-validate="'required|email'"
                            v-model="email"
                            :error-messages="errors.collect('email')"
                            label="Email"
                            name="email"/>
                        <v-text-field
                            @keydown.enter="submit"
                            v-model="senha"
                            class="mb-3"
                            label="Senha"
                            v-validate="'required'"
                            name="password"
                            :error-messages="errors.collect('password')"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"/>
                        <v-checkbox
                            v-model="keepLogged"
                            label="Manter login"
                            type="checkbox"/>
                        <v-btn
                            class="mr-4"
                            color="primary"
                            type="submit"
                            @click="submit">
                            Login
                        </v-btn>
                        <v-btn color="secondary" @click="redirecionarTelaCadastro">
                        Cadastrar
                        </v-btn>
                    </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import AutenticacaoApiRequest from '../utils/AutenticacaoApiRequest'

export default {
  name: 'Login',
  data: () => ({
    showPassword: false,
    email: '',
    senha: '',
    keepLogged: true
  }),
  methods: {
      async submit() {
          if(await this.$validator.validateAll()) {
            const {data, status} = await AutenticacaoApiRequest.login({
                identifier: this.email,
                password: this.senha
            })

            this.inserirInformacoesAutenticacaoStore(data)
            
            if (this.keepLogged) {
                localStorage.setItem('token', data.jwt)
            }

            if (status === 200) {
                await this.redirecionarHome()
            }
          }
      },
      inserirInformacoesAutenticacaoStore(informacoes) {
        this.$store.commit('setToken', informacoes.jwt)
        this.$store.commit('setUserAuth', informacoes.user)
      },
      async redirecionarTelaCadastro() {
          await this.$router.push({
              name: 'Cadastro'
          })
      },
      async redirecionarHome() {
          await this.$router.push({
              name: 'Home'
          })
      }
  }
};
</script>

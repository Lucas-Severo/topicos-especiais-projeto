<template>
    <v-container fill-height >
        <v-row align="center" justify="center">
            <v-col cols="4">
                <h2 class="text-center">Realizar Cadastro</h2>
                    <div class="mb-10">
                        <v-text-field
                            v-validate="'required|max:100'"
                            v-model="nome"
                            :error-messages="errors.collect('nome')"
                            counter="100"
                            label="Nome"
                            name="nome"/>
                        <v-text-field
                            v-validate="'required|email'"
                            v-model="email"
                            :error-messages="errors.collect('email')"
                            label="Email"
                            name="email"/>
                        <v-text-field
                            v-validate="'required|alpha_dash|max:50'"
                            v-model="apelido"
                            counter="50"
                            :error-messages="errors.collect('apelido')"
                            label="Apelido"
                            name="apelido"/>
                        <v-text-field
                            v-model="senha"
                            class="mb-3"
                            label="Senha"
                            v-validate="'required'"
                            name="senha"
                            :error-messages="errors.collect('senha')"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"/>
                        <v-btn
                            color="primary"
                            class="mr-4"
                            @click="submit">
                            Cadastrar
                        </v-btn>
                        <v-btn
                            color="secondary"
                            type="submit"
                            @click="redirecionarTelaLogin">
                            Login
                        </v-btn>
                        
                    </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import AutenticacaoApiRequest from '../utils/AutenticacaoApiRequest'

export default {
  name: 'Cadastro',
  data: () => ({
    showPassword: false,
    nome: '',
    email: '',
    senha: '',
    apelido: ''
  }),
  methods: {
      async submit() {
          if(await this.$validator.validateAll()) {
            const {data, status} = await AutenticacaoApiRequest.registrar({
                name: this.nome,
                email: this.email,
                password: this.senha,
                username: this.apelido
            })
            if(status === 201) {
                this.$store.commit("mostrarAlerta")
                this.$store.commit("setMensagemAlerta", "Cadastro realizada com sucesso!")
                this.$store.commit('setTipoMensagemAlerta', 'success')
                await this.redirecionarTelaLogin()
            }
          }
      },
      async redirecionarTelaLogin() {
          await this.$router.push({
              name: 'Login'
          })
      }
  }
};
</script>

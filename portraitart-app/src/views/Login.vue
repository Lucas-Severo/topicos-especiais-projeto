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
                            v-model="senha"
                            class="mb-3"
                            label="Senha"
                            v-validate="'required'"
                            name="password"
                            :error-messages="errors.collect('password')"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"/>
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

export default {
  name: 'Login',
  data: () => ({
    showPassword: false,
    email: '',
    senha: ''
  }),
  methods: {
      async submit() {
          const response = await this.$validator.validateAll()
      },
      async redirecionarTelaCadastro() {
          await this.$router.push({
              name: 'Cadastro'
          })
      }
  }
};
</script>

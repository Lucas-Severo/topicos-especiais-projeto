<template>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      width="800"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Informações Retrato

          <v-spacer/>
          <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>

        <div class="d-flex ml-5">
            <v-img
                v-if="image"
                class="col-1 mb-2 pl-4 mr-3"
                :lazy-src="obterUrlImagem()"
                min-height="300"
                min-width="400"
                max-height="300"
                max-width="400"
                contain
                :src="obterUrlImagem()"/>

            <div class="d-flex flex-column justify-around mr-4">
                <v-card-text>
                    <h2 class="font-weight-bold">Título Retrato</h2>
                    <p class="font-weight-bold">Preço: R$ 42,00</p>
                </v-card-text>
                <v-btn color="primary">Comprar</v-btn>
            </div>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'Modal',
    props: ['value', 'image'],
    data() {
        return {
            dialog: this.value
        }
    },
    watch: {
        'value'(valor) {
            this.dialog = valor
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog');
        },
        obterUrlImagem() {
            if (this.image) {
                return 'http://localhost:1337'+this.image.url
            }
        }
    }
}
</script>

<style>

</style>
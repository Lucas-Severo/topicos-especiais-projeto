<template>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      width="400"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Adicionar Retrato

          <v-spacer/>
          <v-icon color="error" @click="closeDialog">mdi-close</v-icon>
        </v-card-title>

        <div class="d-flex flex-column ml-4 mr-4 pb-5">
            <div>
                <v-text-field
                    v-model="titulo"
                    v-validate="'max:50'"
                    :error-messages="errors.collect('titulo')"
                    label="Título"
                    counter="50"
                    name="titulo"/>

                <v-text-field
                    v-validate="'required'"
                    class="mb-4"
                    v-model="preco"
                    :error-messages="errors.collect('preco')"
                    label="Preço"
                    name="preco"/>

                <v-file-input
                    v-model="qualidadeMinima"
                    v-validate="'required'"
                    name="qualidadeMinima"
                    :error-messages="errors.collect('qualidadeMinima')"
                    label="Qualidade Mínima"
                    accept="image/png, image/jpeg"
                    filled
                    prepend-icon="mdi-camera"
                ></v-file-input>

                <v-file-input
                    v-model="qualidadeMaxima"
                    v-validate="'required'"
                    name="qualidadeMaxima"
                    :error-messages="errors.collect('qualidadeMaxima')"
                    label="Alta Definição"
                    accept="image/png, image/jpeg"
                    filled
                    prepend-icon="mdi-camera"
                ></v-file-input>

                <v-btn 
                    @click="adicionarRetrato"
                    color="primary">
                    Adicionar
                </v-btn>
            </div>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ModalAdicionarRetrato',
    props: ['value'],
    data() {
        return {
            dialog: this.value,
            titulo: '',
            preco: '',
            qualidadeMinima: null,
            qualidadeMaxima: null
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
        async adicionarRetrato() {
            await this.$validator.validateAll()
        }
    }
}
</script>

<style scoped lang="stylus">
    
</style>
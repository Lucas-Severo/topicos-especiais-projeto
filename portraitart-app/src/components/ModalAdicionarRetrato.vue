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

                <ImagePicker
                    :value="qualidadeMinima"
                    :profileMode="false"
                    :showDefaultImage="false"
                    :readOnly="false"
                    label="Qualidade Mínima"
                    :required="true"
                    name="qualidadeMinima"
                    class="mr-5"/>

                <ImagePicker
                    :value="qualidadeMaxima"
                    :profileMode="false"
                    :showDefaultImage="false"
                    :readOnly="false"
                    label="Qualidade Máxima"
                    :required="true"
                    name="qualidadeMaxima"
                    class="mr-5"/>

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
import ImagePicker from '../components/ImagePicker.vue'

export default {
    name: 'ModalAdicionarRetrato',
    props: ['value'],
    components: {
        ImagePicker
    },
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
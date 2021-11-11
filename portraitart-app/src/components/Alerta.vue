<template>
    <v-alert
    :value="exibirAlerta"
    class="alerta"
    border="right"
    type="error"
    dismissible
    transition="scale-transition"
    >
        {{mensagemAlerta}}
        <template v-slot:close="{ }">
            <v-icon @click="fecharAlerta">mdi-close</v-icon>
        </template>
    </v-alert>
</template>

<script>
import store from '../store'

export default {
    name: 'Alerta',
    computed: {
        exibirAlerta() {
            return store.state.exibirAlerta
        },
        mensagemAlerta() {
            return store.state.mensagemAlerta
        }
    },
    methods: {
        fecharAlerta() {
            this.$store.commit('esconderAlerta')
        }
    }
}
</script>

<style lang="stylus" scoped>
    .alerta {
        position: absolute;
        top: 0;
        right: 0;
        margin: 15px 15px 0 0;
    }
</style>


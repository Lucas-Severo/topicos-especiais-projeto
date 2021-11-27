<template>
  <div>
    <hello-world></hello-world>
    <v-expansion-panels class="pb-5 pl-4 pr-4" multiple v-model="panels">
      <v-expansion-panel
        v-for="categoria in categorias"
        :key="categoria.id"
      >
        <v-expansion-panel-header color="primary">
          <h3 class="white--text">{{categoria.nome}}</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="#DADADA">
          <v-row class="pt-4 d-flex align-center">
            <v-col cols="12" v-if="!possuiItensCategoria(categoria.nome)">
              <p class="text-center grey--text-lighten-5">Nenhum retrato cadastrado nessa categoria :(</p>
            </v-col>

            <image-hover
                v-for="retrato in retratosAgrupados[categoria.nome]"
                @click="()=>abrirModalInfoImagem(retrato)"
                :key="retrato.id"
                :retrato="retrato"
                :minHeight="150"
                :minWidth="250"
                :maxHeight="150"
                :maxWidth="250"
                :image="retrato.imagem_baixa_definicao[0]"
            />
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'
  import RetratoApiRequest from '../utils/RetratoApiRequest'
  import CategoriaApiRequest from '../utils/CategoriaApiRequest'
  import store from '../store'
  import ImageHover from '../components/ImageHover.vue'

  export default {
    name: 'Home',
    components: {
      HelloWorld,
      ImageHover
    },
    data() {
      return {
        categorias: [],
        retratosPorCategoria: {},
        panels: []
      }
    },
    computed: {
      retratosAgrupados() {
        return store.state.retratosAgrupadosPorCategoria
      }
    },
    async mounted() {
      await RetratoApiRequest.buscarTodosRetratos()
      const {data: categorias} = await CategoriaApiRequest.buscarTodos()
      this.categorias = categorias

      for (let i = 0; i < categorias.length; i++) {
        this.panels.push(i)
      }

      await this.agruparPorCategoria()
      this.$store.commit('setRetratosAgrupadosPorCategoria', this.retratosPorCategoria)
    },
    methods: {
      async agruparPorCategoria() {
        for (let categoria of this.categorias) {
          const {data: retratos} = await RetratoApiRequest.buscarPorCategoria(categoria.nome, 5)
          this.retratosPorCategoria[categoria.nome] = retratos
        }
      },
      possuiItensCategoria(categoria) {
        if (this.retratosAgrupados[categoria] && this.retratosAgrupados[categoria].length > 0) {
          return true
        }
        return false
      },
      async abrirModalInfoImagem(retrato) {
        await this.$router.push({
            name: 'ModalRetrato',
            params: {
                username: retrato.usuario.username,
                uid: retrato.uid
            }
        })
      }
    }
  }
</script>

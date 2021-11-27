<template>
  <div>
    <modal-adicionar-retrato
        v-model="dialogAdicionarRetrato"
        @closeDialog="fecharModalAdicionarRetrato"
        @showImageFullScreen="showImageFullScreen"
        :defaultCategoria="categoriaSelecionada"/>
    <hello-world></hello-world>
    <v-expansion-panels class="pb-5 pl-4 pr-4" multiple v-model="panels">
      <v-expansion-panel
        v-for="categoria in categorias"
        :key="categoria.id"
      >
        <v-expansion-panel-header color="#2196F3">
          <template v-slot:actions>
            <v-icon color="white">
              $expand
          </v-icon>
          </template>
          <h3 class="white--text">{{categoria.nome}}</h3>
          <v-spacer/>
          <v-btn 
              v-if="estaAutenticado"
              @click.stop="() => abrirModalAdicionarRetrato(categoria)"
              max-width="150"
              class="mr-3"
              color="success">Novo Retrato
          </v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="#EEF">
          <v-row class="pt-4 d-flex align-center">
            <v-col cols="12" v-if="!possuiItensCategoria(categoria.nome)">
              <p class="text-center grey--text-lighten-5">Nenhum retrato cadastrado nessa categoria :(</p>
            </v-col>

            <v-col 
                v-for="retrato in retratosAgrupados[categoria.nome]"
                :key="retrato.id"
                md="3"
                sm="12">
              <image-hover
                  @click="()=>abrirModalInfoImagem(retrato)"
                  :retrato="retrato"
                  :minHeight="150"
                  minWidth="100%"
                  :maxHeight="150"
                  maxWidth="100%"
                  :image="retrato.imagem_baixa_definicao[0]"/>
            </v-col>
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
  import ModalAdicionarRetrato from '../components/ModalAdicionarRetrato.vue'

  export default {
    name: 'Home',
    components: {
      HelloWorld,
      ImageHover,
      ModalAdicionarRetrato
    },
    data() {
      return {
        categorias: [],
        retratosPorCategoria: {},
        panels: [],
        dialogAdicionarRetrato: false,
        categoriaSelecionada: null
      }
    },
    computed: {
      retratosAgrupados() {
        return store.state.retratosAgrupadosPorCategoria
      },
      estaAutenticado() {
        return !!store.state.userAuth.id
      }
    },
    async mounted() {
      await this.buscarTodosRetratos()
    },
    methods: {
      async buscarTodosRetratos() {
        this.$store.commit('setShowLoading', true)
        await RetratoApiRequest.buscarTodosRetratos()
        const {data: categorias} = await CategoriaApiRequest.buscarTodos()
        this.categorias = categorias

        for (let i = 0; i < categorias.length; i++) {
          this.panels.push(i)
        }

        await this.agruparPorCategoria()
        this.$store.commit('setRetratosAgrupadosPorCategoria', this.retratosPorCategoria)
        this.$store.commit('setShowLoading', false)
      },
      async agruparPorCategoria() {
        for (let categoria of this.categorias) {
          const {data: retratos} = await RetratoApiRequest.buscarPorCategoria(categoria.nome, 12)
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
      },
      async buscarRetratosPorCategoria() {
        if (this.categoriaSelecionada) {
          const {data: retratos} = await RetratoApiRequest.buscarPorCategoria(this.categoriaSelecionada.nome, 12)
          this.retratosPorCategoria[this.categoriaSelecionada.nome] = [...retratos]
        }
      },
      abrirModalAdicionarRetrato(categoria) {
        this.dialogAdicionarRetrato = true
        this.categoriaSelecionada = categoria
      },
      async fecharModalAdicionarRetrato() {
        this.$store.commit('setShowLoading', true)
        await this.buscarRetratosPorCategoria()
        this.$store.commit('setRetratosAgrupadosPorCategoria', this.retratosPorCategoria)
        this.dialogAdicionarRetrato = false
        this.$store.commit('setShowLoading', false)
      },
      showImageFullScreen(image) {
        this.$store.commit('setMostrarImagemFullScreen', true)
        this.$store.commit('setImagemFullScreen', image)
      }
    }
  }
</script>

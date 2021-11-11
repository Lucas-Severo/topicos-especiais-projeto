<template>
  <hello-world />
</template>

<script>
  import HelloWorld from '../components/HelloWorld'
  import RetratoApiRequest from '../utils/RetratoApiRequest'

  export default {
    name: 'Home',

    components: {
      HelloWorld,
    },
    async mounted() {
      await RetratoApiRequest.buscarTodosRetratos()
    }
  }
</script>

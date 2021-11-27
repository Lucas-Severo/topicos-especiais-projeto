<template>
  <v-overlay v-if="showLoading" z-index="3000" class="text-center">
    <v-progress-circular
      size="50"
      indeterminate
      color="white"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import store from '../store'

export default {
    name: 'ProgressBar',
    computed: {
        showLoading() {
            return store.state.showLoading
        }
    }
}
</script>

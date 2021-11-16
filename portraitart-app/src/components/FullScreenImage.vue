<template>
    <v-overlay 
        @wheel="tratarEventoWheel" 
        :value="mostrarImagemFullScreen" 
        z-index="300">
        <v-img
            class="image-fullscreen"
            :src="getImageFullScreen"
            :width="widthImageFullScreen+'vh'"
            height="100%"/>

        <div class="top-right-fixed">
            <v-btn
                color="black"
                @click="hideFullScreen">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>

        <div class="center-fixed mb-4">
            <v-btn 
                class="mr-3"
                color="black"
                @click="widthImageFullScreen+=10">
                <v-icon>mdi-magnify-plus-outline</v-icon>
            </v-btn>
            <v-btn
                color="black"
                @click="widthImageFullScreen-=10">
                <v-icon>mdi-magnify-minus-outline</v-icon>
            </v-btn>
        </div>
    </v-overlay>
</template>

<script>
import store from '../store'
import ConfigProvider from '../utils/ConfigProvider'

export default {
    name: 'FullScreenImage',
    data() {
        return {
            widthImageFullScreen: 70
        }
    },
    computed: {
        getImageFullScreen() {
            const imagemFullScreen = this.imagemFullScreen()
            if (imagemFullScreen && imagemFullScreen instanceof File) {
                return URL.createObjectURL(imagemFullScreen)
            }
            if (imagemFullScreen) {
                return ConfigProvider.getBaseUrl() + imagemFullScreen.url
            }
        },
        mostrarImagemFullScreen() {
            return store.state.fullScreenImage.mostrarImagemFullScreen
        }
    },
    methods: {
        tratarEventoWheel(event) {
            if (event.deltaY < 0) {
                this.widthImageFullScreen += 10
            }
            else if (event.deltaY > 0) {
                this.widthImageFullScreen -= 10
            }
        },
        hideFullScreen() {
            this.$store.commit('setMostrarImagemFullScreen', false)
        },
        imagemFullScreen() {
            return store.state.fullScreenImage.imagemFullScreen
        }
    }
}
</script>

<style lang="stylus" scoped>
    .top-right-fixed
        position fixed
        top 0
        right 0
        margin 10px

    .center-fixed
        position fixed
        bottom 0
        right 50%
        transform: translate(50%, 0);

    .image-fullscreen
        transition: all .2s ease-in-out;
</style>
<template>
    <div>
        <v-hover
            v-slot="{ hover }"
        >
            <div
                :class="{ 'hover': hover }">
                <v-img
                    v-if="!edit"
                    :lazy-src="obterUrlImagem()"
                    :height="height"
                    :class="[profileMode && 'profile-mode']"
                    :width="profileMode? height: width"
                    :src="obterUrlImagem()"/>

                <v-menu top v-if="!edit">
                    <template v-slot:activator="{ on, attrs }">
                        <div
                            class="cursor-pointer editable-container"
                            v-bind="attrs"
                            v-on="on">
                            <v-icon size="20" v-if="readOnly" color="white">mdi-eye</v-icon>
                            <v-icon v-else color="white">mdi-pencil-outline</v-icon>
                        </div>
                    </template>

                    <v-list>
                        <v-list-item v-if="!readOnly" @click="editarImagem">
                            <v-list-item-title>Editar Imagem</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="verImagem">
                            <v-list-item-title>Ver Imagem</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-hover>
        <div v-if="edit" class="d-flex align-top justify-center image-picker mt-5">
            <v-file-input
                v-model="imageChanged"
                label="ImagePicker"
                accept="image/png, image/jpeg"
                filled
                prepend-icon="mdi-camera"
            ></v-file-input>
            <v-icon class="confirm-button" @click="selecionarImagem">mdi-check</v-icon>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImagePicker',
    props: {
        value: {
            type: Array
        },
        height: {
            type: Number,
            default: 100
        },
        width: {
            type: Number,
            default: 200
        },
        readOnly: {
            type: Boolean,
            default: true
        },
        profileMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            edit: false,
            image: this.value,
            imageChanged: this.value
        }
    },
    watch: {
        'value': {
            handler(value) {
                this.image = value
                this.imageChanged = value
            },
            deep: true
        }
    },
    methods: {
        editarImagem() {
            if (!this.readOnly) {
                this.edit = true
            }
        },
        selecionarImagem() {
            this.edit = false
            this.updateImage(this.imageChanged)
        },
        updateImage(image) {
            if (image && !Array.isArray(image)) {
                this.$emit('updateImage', image)
            }
        },
        obterUrlImagem() {
            if (!this.contemImagem()) {
                return require("@/assets/default_profile_image.png")
            }
            return "http://localhost:1337" + this.image[0].url
        },
        contemImagem() {
            if (Array.isArray(this.image)) {
                return this.image.length !== 0
            }
            return this.image !== undefined
        },
        verImagem() {
            this.$emit('showImageFullScreen', this.image)
        }
    }
}
</script>

<style lang="stylus" scoped>
    .image-picker
        width 300px
        margin-right 18px

    .confirm-button
        color #1976d2
        margin-bottom 20px
        margin-left 5px

    .cursor-pointer
        cursor pointer

    .editable-container
        position absolute
        visibility: hidden

    .hover
        position relative

    .hover .editable-container
        visibility: visible
        top: 0
        left: 0
        color: #fff
        background-color: #222a
        display: flex
        align-items: center
        justify-content: center
        width: 100%
        height: 100%
    
    .profile-mode
        border-radius: 50%
</style>
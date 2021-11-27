<template>
    <div>
        <v-hover
            v-slot="{ hover }"
        >
            <div
                :class="{ 'hover': hover }">
                <v-img
                    v-if="!edit"
                    :lazy-src="obterUrlImagem"
                    :height="height"
                    :class="[profileMode && 'profile-mode']"
                    :width="profileMode? height: width"
                    :src="obterUrlImagem"/>

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
                :label="label"
                v-validate="required && 'required'"
                accept="image/png, image/jpeg"
                :name="name"
                :error-messages="errors.collect(name)"
                filled
                prepend-icon="mdi-camera"
                append-outer-icon="mdi-check"
                @change="selecionarImagem"
                @click:append-outer="selecionarImagem"
            ></v-file-input>
        </div>
    </div>
</template>

<script>
import ConfigProvider from '../utils/ConfigProvider'

export default {
    name: 'ImagePicker',
    props: {
        value: {
            type: [Object, File]
        },
        height: {
            type: [Number, String],
            default: 100
        },
        width: {
            type: [Number, String],
            default: 200
        },
        readOnly: {
            type: Boolean,
            default: true
        },
        profileMode: {
            type: Boolean,
            default: false
        },
        showDefaultImage: {
            type: Boolean,
            default: true
        },
        label: {
            type: String,
            default: "Image Picker"
        },
        required: {
            type: Boolean,
            defeault: false
        },
        name: {
            type: String,
            default: 'image'
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
                this.gerenciarDefaultImage()
            },
            deep: true
        }
    },
    computed: {
        obterUrlImagem() {
            if (!this.contemImagem()) {
                return require("@/assets/default_profile_image.png")
            }
            if (this.image instanceof File) {
                return URL.createObjectURL(this.image)
            }
            return ConfigProvider.getFileProviderUrl() + this.image.url
        }
    },
    mounted() {
        this.gerenciarDefaultImage()
    },
    methods: {
        editarImagem() {
            if (!this.readOnly) {
                this.edit = true
            }
        },
        async selecionarImagem() {
            let allowEditImage = true
            if (this.required) {
                allowEditImage = await this.$validator.validateAll()
            }
            if (allowEditImage) {
                this.edit = false
                this.updateImage(this.imageChanged)
            }
        },
        updateImage(image) {
            if (image && !Array.isArray(image)) {
                this.image = this.imageChanged
                this.$emit('updateImage', image)
            }
        },
        contemImagem() {
            if (Array.isArray(this.image)) {
                return this.image.length !== 0
            }
            return this.image !== undefined && this.image !== null
        },
        verImagem() {
            this.$emit('showImageFullScreen', this.image)
        },
        gerenciarDefaultImage() {
            if (!this.contemImagem() && !this.showDefaultImage) {
                this.edit = true
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
    .cursor-pointer
        cursor pointer

    .editable-container
        position absolute
        visibility: hidden
        top: 0
        left: 0

    .hover
        position relative

    .hover .editable-container
        visibility: visible
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
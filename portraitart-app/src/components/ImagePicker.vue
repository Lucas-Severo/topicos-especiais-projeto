<template>
    <div>
        <v-icon 
            @click="editarImagem" 
            class="image"
            :class="[readOnly ? '': 'cursor-pointer hover']"
            v-if="!edit && !contemImagem" dense size="150">
            mdi-account
        </v-icon>
        <v-img
            @click="editarImagem"
            v-else-if="!edit && contemImagem"
            :lazy-src="obterUrlImagem()"
            :height="height"
            :width="width"
            contain
            class="image"
            :class="[readOnly ? '': 'cursor-pointer editable-img']"
            :src="obterUrlImagem()"/>
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
    computed: {
        contemImagem() {
            if (Array.isArray(this.image)) {
                return this.image.length !== 0
            }
            return this.image !== undefined
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
            if (image) {
                this.$emit('updateImage', image)
            }
        },
        obterUrlImagem() {
            return "http://localhost:1337" + this.image[0].url
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

    .image
        position relative

    .cursor-pointer
        cursor pointer

    .editable-img:hover::before
        content: 'Mudar imagem'
        color: #fff
        background-color: #333a
        display: flex
        align-items: center
        justify-content: center
        width: 100%
        height: 100%
    
</style>
<template>
    <div>
        <v-icon @click="editarImagem" v-if="!edit && !contemImagem" dense size="150">mdi-account</v-icon>
        <v-img
            @click="editarImagem"
            v-else-if="!edit && contemImagem"
            :lazy-src="obterUrlImagem()"
            max-height="150"
            max-width="250"
            :src="obterUrlImagem()"
            />
        <div v-if="edit" class="d-flex align-center image-picker">
            <v-file-input
                v-model="imageChanged"
                label="ImagePicker"
                accept="image/png, image/jpeg"
                filled
                prepend-icon="mdi-camera"
            ></v-file-input>
            <v-icon @click="selecionarImagem">mdi-check</v-icon>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImagePicker',
    props: {
        value: {
            type: Array
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
            this.edit = true
        },
        selecionarImagem() {
            this.edit = false
            this.updateImage(this.imageChanged)
        },
        updateImage(image) {
            this.$emit('updateImage', image)
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
</style>
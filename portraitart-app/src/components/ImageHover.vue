<template>
    <v-hover
        v-slot="{ hover }">

        <div 
            :class="{ 'hover': hover }">
            <v-img
                class="col-1 mr-4 mb-2"
                :lazy-src="obterUrl()"
                :min-height="minHeight"
                :min-width="minWidth"
                :max-height="minHeight"
                :max-width="maxWidth"
                :src="obterUrl()"/>
            <div
                @click="click"
                :style="{ maxWidth: maxWidth+'px', maxHeight: maxHeight + 'px' }"
                class="editable-container cursor-pointer">
                <v-icon color="white">mdi-eye</v-icon>
            </div>
        </div>
    </v-hover>
</template>

<script>
import ConfigProvider from '../utils/ConfigProvider'

export default {
    name: 'ImageHover',
    props: ['image', 'baseUrl', 'minHeight', 'maxHeight', 'minWidth', 'maxWidth'],
    data() {
        return {
        }
    },
    methods: {
        click() {
            this.$emit('click', this.retrato)
        },
        obterUrl() {
            return ConfigProvider.getFileProviderUrl()+this.image.url
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
</style>
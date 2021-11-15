<template>
    <div>
        <div v-if="edit">
            <v-autocomplete
                v-model="editValue"
                v-validate="validacoes"
                :items="items"
                item-text="nome"
                item-value="id"
                :name="name"
                :error-messages="errors.collect(name)"
                :label="label">

                <template slot="append-outer">
                    <v-icon 
                        @click="cancelEdit" 
                        class="mr-2">mdi-close</v-icon>
                    <v-icon @click="updateValue">mdi-check</v-icon>
                </template>
            </v-autocomplete>
        </div>
        
        <div class="d-flex align-center" v-else>
            <label>{{titulo}}</label>
            <v-icon
                @click="startEdit"
                class="ml-2" 
                size="20" 
                v-if="!readOnly">
                mdi-pencil
            </v-icon>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditableAutoComplete',
    props: [
        'value',
        'items',
        'required',
        'label', 
        'name',
        'readOnly',
        'noValueMessage'
    ],
    data() {
        return {
            edit: false,
            editValue: this.value
        }
    },
    mounted() {
        this.edit = false
    },
    computed: {
        titulo() {
            if (this.value) {
                return this.value.nome
            }
            return this.noValueMessage
        },
        validacoes() {
            let validacao = ''

            if (this.required) {
                validacao += 'required'
            }
            return validacao
        }
    },
    methods: {
        startEdit() {
            this.edit = true
            this.editValue = this.value
        },
        async cancelEdit() {
            this.edit = false
            this.editValue = this.value
        },
        async updateValue() {
            this.edit = false
            this.$emit('updateValue', this.editValue)
        }
    }
}
</script>
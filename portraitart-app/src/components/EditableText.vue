<template>
    <div>
        <div v-if="edit">
            <v-text-field
                v-model="obterValor"
                v-validate="validacoes"
                :error-messages="errors.collect(name)"
                :label="label"
                :counter="counter"
                :maxLength="maxLength"
                v-mask="obterMascara"
                :name="name">

                <template slot="append-outer">
                    <v-icon 
                        @click="cancelEdit" 
                        class="mr-2">mdi-close</v-icon>
                    <v-icon @click="updateValue">mdi-check</v-icon>
                </template>
            </v-text-field>
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
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

const currencyMask = createNumberMask({
    prefix: 'R$ ',
    allowDecimal: true,
    includeThousandsSeparator: true,
    decimalSymbol: ',',
    thousandsSeparatorSymbol: '.',
    allowNegative: false,
});

export default {
    name: 'EditableText',
    props: [
        'value', 
        'required',
        'maxLength',
        'label', 
        'name', 
        'counter',
        'readOnly',
        'noValueMessage',
        'currency'],
    data() {
        return {
            edit: false,
            editText: this.value
        }
    },
    mounted() {
        this.edit = false
    },
    computed: {
        titulo() {
            if (this.currency) {
                const formatter = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2
                })
                
                return formatter.format(this.value)
            }
            return this.value || this.noValueMessage
        },
        validacoes() {
            let validacao = ''

            if (this.required) {
                validacao += 'required'
            }
            if (this.maxLength) {
                if (validacao !== '') {
                    validacao += '|'
                }
                validacao += 'max:'+this.maxLength
            }
            return validacao
        },
        obterMascara() {
            if (this.currency) {
                return currencyMask
            }
        },
        obterValor: {
            get: function () {
                if (this.currency) {
                    return String(this.editText).replace(".", ",")
                }
                return this.editText
            },
            set: function (valor) {
                this.editText = valor
            }
        }
    },
    methods: {
        startEdit() {
            this.edit = true
            this.editText = this.value
        },
        async cancelEdit() {
            this.edit = false 

            if (this.currency) {
                await this.$validator.attach()
            }

            this.editText = this.value
        },
        async updateValue() {
            this.edit = false
            if (this.currency) {
                await this.$validator.attach()
                this.editText = this.obterPrecoSemFormatacao(this.editText)
            }
            this.$emit('updateValue', this.editText)
        }
    }
}
</script>
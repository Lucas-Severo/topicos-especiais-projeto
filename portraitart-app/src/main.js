import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import VeeValidate, {Validator} from 'vee-validate'
import VueMask from 'v-mask'
import ptBR from 'vee-validate/dist/locale/pt_BR'
import obterPrecoSemFormatacao from './mixins/obterPrecoSemFormatacao'

Vue.config.productionTip = false

const config = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: null,
  errorBagName: 'errors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations', // the nested key under which the validation messages will be located
  inject: true,
  locale: ptBR,
  validity: false,
  useConstraintAttrs: true
};

const myMixin = {
  methods: {
    obterPrecoSemFormatacao(valor) {
      const objetos = {
          '.': ',',
          ',': '.'
      }
      valor = valor.replace('R$ ', '')
      valor = valor.replace(/.|,/g, function(matched){
          if (matched === '.') {
              return ''
          } else if (matched === ',') {
              return '.'
          }
          return matched
      })
      return valor
    }
  }
}

Vue.use(VeeValidate, config);
Vue.use(VueMask);

Validator.localize('pt_BR', ptBR)

Vue.mixin(myMixin)

new Vue({
  store,
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
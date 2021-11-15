import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import PerfilUsuario from '../views/PerfilUsuario.vue'
import ModalRetrato from '../components/ModalRetrato'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    exact: true
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro
  },
  {
    path: '/perfil/:username',
    name: 'PerfilUsuario',
    component: PerfilUsuario,
    children: [
      {
        path: 'retrato/:uid',
        name: 'ModalRetrato',
        component: ModalRetrato
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

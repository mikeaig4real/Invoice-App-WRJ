import Vue from 'vue'

import VueRouter from 'vue-router'

import InvoicesView from '../views/InvoicesView.vue'

import InvoiceView from '../views/InvoiceView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'invoices',
    component: InvoicesView,
    props: true,
  },
  {
    path: '/invoice/:id',
    name: 'invoice',
    component: InvoiceView,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

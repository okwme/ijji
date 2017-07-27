import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Collection from '@/components/Collection'
import Product from '@/components/Product'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/collections/:id?',
      name: 'Collection',
      component: Collection,
      props: true
    },
    {
      path: '/product/:id?',
      name: 'Product',
      component: Product,
      props: true
    }
  ]
})

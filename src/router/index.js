import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Collection from '@/components/Collection'
import Product from '@/components/Product'
import Page from '@/components/Page'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    console.log(to)
    console.log(from)
    console.log(savedPosition)
    if (from.name !== 'Product' || to.name !== 'Product') {
      return { x: 0, y: 0 }
    }
  },
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
    },
    {
      path: '/pages/:id?',
      name: 'Page',
      component: Page,
      props: true
    },
    {
      path: '*',
      component: Page
    }
  ]
})

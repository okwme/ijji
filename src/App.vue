<template>
  <div id="app">
    <toolbar :cart='cart' :collections='collections'></toolbar>
    <cart :cart='cart'></cart>
    <router-view :products='products' :collections='collections' :cart='cart'></router-view>
    <bottom :collections='collections'></bottom>
  </div>
</template>

<script>
import Cart from './components/Cart'
import Bottom from './components/Bottom'
import Toolbar from './components/Toolbar'
export default {
  name: 'app',
  data () {
    return {
      cart: {},
      products: [],
      collections: []
    }
  },
  components: {
    Cart,
    Bottom,
    Toolbar
  },
  computed: {
  },
  created () {
    this.$client.fetchAllProducts().then((products) => {
      this.products = products
    })
    this.$client.fetchAllCollections().then((collections) => {
      this.collections = collections
    })
    this.$client.fetchRecentCart().then((cart) => {
      this.cart = cart
    })
  },
  methods: {
  }
}
</script>

<style>

</style>

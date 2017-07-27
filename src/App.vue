<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view :products='products'></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      products: [],
      collections: [],
      makingCart: false
    }
  },
  computed: {
    cart () {
      return this.$cookie.get('cart')
    }
  },
  watch: {
    cart () {
      if (!this.cart && !this.makingCart) {
        this.makeCart()
      }
    }
  },
  mounted () {
    console.log('mounted')
    this.$client.fetchAllProducts().then((products) => {
      console.log(products)
      this.products = products
    })
    this.$client.fetchAllCollectionsWithProducts().then((collections) => {
      console.log(collections)
      this.collections = collections
    })
    if (!this.cart) {
      this.makingCart = true
      this.makeCart()
    }
  },
  methods: {
    makeCart () {
      this.$client.createCheckout().then((checkout) => {
        console.log(checkout)
        // this.makingCart = false
        // this.cart = checkout
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

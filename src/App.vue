<template>
  <div id="app">
    <cart :cart='cart'></cart>
    <toolbar :cart='cart' :collections='collections' :product-collections='productCollections'></toolbar>
    <router-view :products='products' :collections='collections' :cart='cart'></router-view>
    <bottom :collections='collections' :product-collections='productCollections'></bottom>
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
      collections: [],
      window: window.innerWidth
    }
  },
  components: {
    Cart,
    Bottom,
    Toolbar
  },
  computed: {
    productCollections () {
      return this.collections.filter((collection) => {
        var prefix = collection.attrs.title.split('-')[0]
        return this.isNumber(prefix)
      }).sort((a, b) => {
        return a.attrs.title.localeCompare(b.attrs.title)
      })
    }
  },
  created () {
    window.onresize = this.$debounce(this.resize, 200)

    this.$client.fetchAllProducts().then((products) => {
      this.products.push(...products)
    })
    this.$client.fetchRecentCart().then((cart) => {
      this.cart = cart
    })
    this.$client.fetchAllCollections().then((collections) => {
      this.collections.push(...collections)
      this.collections.forEach((collection, i) => {
        this.$client.fetchQueryProducts({collection_id: collection.attrs.collection_id}).then(products => {
          collection.attrs.products = products
          this.collections.splice(i, 1, collection)
          this.addCollectionToProducts(products, collection)
        })
      })
    })
  },
  methods: {
    resize (e) {
      console.log('resize')
      this.window = window.innerWidth
    },
    collectionTitle (title) {
      var chunk = title.split('-')
      chunk.shift()
      return chunk.join('-')
    },
    isNumber (string) {
      return !isNaN(parseFloat(string)) && isFinite(string)
    },
    addCollectionToProducts (products, collection) {
      products.forEach(product => {
        var productIndex = this.products.findIndex((p) => {
          return p.attrs.product_id === product.attrs.product_id
        })
        product = productIndex > -1 && this.products[productIndex]
        if (product.attrs.collections) {
          product.attrs.collections.push(collection)
        } else {
          product.attrs.collections = [collection]
        }
        this.products.splice(productIndex, 1, product)
      })
    }
  }
}
</script>

<style  lang='scss'>
  @import "sass/grid";
</style>

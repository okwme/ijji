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
      collections: []
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
    this.$client.fetchAllProducts().then((products) => {
      this.products = products
    })
    this.$client.fetchRecentCart().then((cart) => {
      this.cart = cart
    })
    this.$client.fetchAllCollections().then((collections) => {
      this.collections = collections
      this.collections.forEach((collection) => {
        this.$client.fetchQueryProducts({collection_id: collection.attrs.collection_id}).then(products => {
          collection.attrs.products = products
          this.addCollectionToProducts(products, collection)
        })
      })
    })
  },
  methods: {
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
        var dataProduct = this.products.filter((p) => {
          return p.attrs.product_id === product.attrs.product_id
        }).pop()
        if (dataProduct.attrs.collections) {
          dataProduct.attrs.collections.push(collection)
        } else {
          dataProduct.attrs.collections = [collection]
        }
      })
    }
  }
}
</script>

<style>

</style>

<template>
  <div id="app">
    <cart @click-cart='clickCart' :cart='cart' :visible='cartVisible'></cart>
    <div class='app' :class='{cartVisible:cartVisible}' @click='cartVisible = false'>
      <toolbar @click-cart='clickCart' :cart='cart' :collections='collections' :product-collections='productCollections'></toolbar>
      <router-view :products='products' :collections='collections' :cart='cart'></router-view>
      <bottom :collections='collections' :product-collections='productCollections'></bottom>
      <div id='maxWidth'></div><div id='tabletWidth'></div><div id='mobileWidth'></div>
    </div>
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
      cartVisible: false,
      products: [],
      collections: [],
      window: window.innerWidth,
      imageRatio: 1.5,
      padding: 12,
      maxWidth: 1200,
      tabletWidth: 1020,
      mobileWidth: 480
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
  mounted () {
    this.setBreakPoints()
  },
  methods: {
    clickCart () {
      this.cartVisible = !this.cartVisible
    },
    resize (e) {
      this.window = window.innerWidth
    },
    setBreakPoints () {
      var ids = ['maxWidth', 'tabletWidth', 'mobileWidth']
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i]
        var el = document.getElementById(id)
        var style = window.getComputedStyle(el)
        this[id] = parseInt(style.getPropertyValue('max-width').slice(0, -2))
      }
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
  .app{
    // position: relative;
    // right:0px;
    // transition: right ease 500ms;
    &.cartVisible {
      // right:320px;
    }
  }
</style>

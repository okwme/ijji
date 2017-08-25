<template>
  <div id="app">
    <cart 
      @update-cart='updateCart'
      @click-cart='clickCart' 
      :cart='cart' 
      :visible='cartVisible'></cart>
    <div class='app' :class='{cartVisible:cartVisible}' @click='cartVisible = false'>
      <toolbar 
      @click-cart='clickCart'
      :color='color'
      :cartVisible='cartVisible'
      :cart='cart' 
      :collections='collections' 
      :product-collections='productCollections'></toolbar>
      <router-view 
      @color-change='colorChange'
      @click-cart='clickCart'
      @update-cart='updateCart' 
      :touchScreen='touchScreen'
      :products='products' 
      :collections='collections' 
      :cart='cart'></router-view>
      <bottom :collections='collections' :product-collections='productCollections'></bottom>
      <div id='desktopWidth'></div><div id='tabletWidth'></div><div id='mobileWidth'></div>
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
      color: null,
      cart: {},
      cartVisible: false,
      products: [],
      collections: [],
      window: window.innerWidth,
      imageRatio: 0.65,
      padding: 12,
      maxWidth: 1200,
      desktopWidth: 1200,
      tabletWidth: 1020,
      mobileWidth: 480,
      touchScreen: false
    }
  },
  components: {
    Cart,
    Bottom,
    Toolbar
  },
  watch: {
    cartVisible () {
      // if (this.cartVisible) {
      //   document.getElementById('body').classList.add('no-scroll')
      // } else {
      //   document.getElementById('body').classList.remove('no-scroll')
      // }
    }
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
    window.addEventListener('touchstart', this.addTouch)
    document.onkeydown = this.keyPress
    window.onresize = this.$debounce(this.resize, 200)
    setTimeout(() => {
      this.resize()
    }, 500)
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
    addTouch () {
      this.touchScreen = true
      window.removeEventListener('touchstart', this.addTouch)
    },
    colorChange (color) {
      this.color = color
    },
    keyPress (e) {
      e = e || window.event
      if (e.keyCode === 27) {
        this.cartVisible = false
      }
    },
    updateCart (cart) {
      this.cart = cart
    },
    clickCart (show = !this.cartVisible) {
      this.cartVisible = show
    },
    resize (e) {
      this.window = window.innerWidth
      var grid = document.querySelectorAll('.grid')
      if (grid.length) {
        grid = grid[0]
        var style = window.getComputedStyle(grid)
        this.maxWidth = parseFloat(style.getPropertyValue('max-width').slice(0, -2))
        this.padding = parseFloat(style.getPropertyValue('padding-right').slice(0, -2)) * (2 / 3)
      }
    },
    setBreakPoints () {
      var ids = ['desktopWidth', 'tabletWidth', 'mobileWidth']
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

<style lang='scss'>
  @import "sass/vars";
  @import "sass/global";
  @import "sass/grid";

  body.no-scroll{
    overflow: hidden;
  }
  .app{
    position: relative;
    right:0px;
    transition: right ease 500ms;
    &.cartVisible {
      right:380px;
    }
  }
</style>

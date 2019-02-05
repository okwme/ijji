<template>
  <div id="app">
    <cart 
      @update-cart='updateCart'
      @click-cart='clickCart' 
      :cart='cart' 
      :checkoutId='checkoutId'
      :visible='cartVisible'></cart>
    <div class='app' :class='{cartVisible:cartVisible}' @click='cartVisible = false'>
      <toolbar 
      @click-cart='clickCart'
      :color='color'
      :cartVisible='cartVisible'
      :checkoutId='checkoutId'
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
      :checkoutId='checkoutId'
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
      checkoutId: null,
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
        var prefix = collection.title.split('-')[0]
        return this.isNumber(prefix)
      }).sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    }
  },
  created () {
    this.addBackInStock()
    window.addEventListener('touchstart', this.addTouch)
    document.onkeydown = this.keyPress
    window.onresize = this.$debounce(this.resize, 200)
    setTimeout(() => {
      this.resize()
    }, 500)
    this.begin()
  },
  mounted () {
    this.setBreakPoints()
  },
  methods: {
    async begin () {
      try {
        let products = await this.$client.product.fetchAll()
        this.products.push(...products)
        this.checkoutId = localStorage.getItem('checkoutId')
        if (!this.checkoutId) {
          let checkout = await this.$client.checkout.create()
          this.checkoutId = checkout.id
          localStorage.setItem('checkoutId', this.checkoutId) // Store the ID in localStorage
        }
        this.cart = await this.$client.checkout.fetch(this.checkoutId)

        let collections = await this.$client.collection.fetchAllWithProducts()
        this.collections.push(...collections)
      } catch (error) {
        console.log(error)
        localStorage.removeItem('checkoutId')
        this.begin()
      }
    },
    addBackInStock () {
      var s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = 'https://app.backinstock.org/widget/6048_' + new Date()
      document.body.appendChild(s)
    },
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

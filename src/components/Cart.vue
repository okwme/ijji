<template>
  <div id='cart' :class='{open:visible}'>
    <h1>Cart ({{count}})</h1>
    <a id='closeCart' href='#' @click.prevent='clickCart'>x</a>
    <div v-if='cart.attrs'>
      <div v-for='item in cart.attrs.line_items'>
        <div class='clicker' @click='removeItem(item)'>X</div>
          <img :src='getSmall(item)'>
          <div class='item-title'>{{item.title}}</div>
          <div class='item-variant-title'>{{item.variant_title}}</div>
          <div class='item-price'>${{item.price}}</div>
          <div class='item-quantity'>
            <a href='#' @click.prevent='quantity(item, -1)'>-</a>
            <span>{{item.quantity}}</span>
            <a href='#' @click.prevent='quantity(item, 1)'>+</a>
          </div>
      </div>
      <div>
        <textarea :model='specialInstructions'></textarea>
      </div>
      <div>
      ${{total}}
      </div>
      <button @click='checkout'>Checkout</button>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Cart',

  data () {
    return {
      specialInstructions: ''
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Object,
      default: {}
    }
  },
  computed: {
    count () {
      if (this.cart.attrs && this.cart.attrs.line_items.length) {
        var count = 0
        var items = this.cart.attrs.line_items
        for (var i = 0; i < items.length; i++) {
          count += items[i].quantity
        }
        return count
      } else {
        return 0
      }
    },
    total () {
      var total = 0
      for (var i = 0; i < this.cart.attrs.line_items.length; i++) {
        var item = this.cart.attrs.line_items[i]
        total += item.quantity * parseFloat(item.price)
      }
      return total.toFixed(2)
    }
  },
  methods: {
    quantity (item, amount) {
      this.cart.updateLineItem(item['shopify-buy-uuid'], (item.quantity + amount))
    },
    checkout () {

    },
    getSmall (item) {
      var src = false
      for (var i = 0; i < item.image_variants.length; i++) {
        var img = item.image_variants[i]
        var w = img.dimension.split('x')[0]
        if (parseInt(w) <= 100) {
          src = img.src
        }
      }
      return src
    },
    clickCart () {
      this.$emit('click-cart')
    },
    removeItem (item) {
      this.cart.removeLineItem(item['shopify-buy-uuid']).then((cart) => {
        this.$emit('update-cart', cart)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#cart {
  background-color: white;
  z-index:2;
  height:100vh;
  overflow: auto;
  border-left:1px solid black;
  position:fixed;
  width:100%;
  right: -100%;
  width: 320px;
  right:-320px;
  transition: right ease 500ms;
  &.open {
    right:0px;
  }
  #closeCart {
    position:absolute;
    top: 20px;
    right:20px;
  }
}
</style>

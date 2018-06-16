<template>
  <div id='cart' :class='{open:visible}'>
    <h1>Cart ({{count}})</h1>
    <a id='closeCart' href='#' @click.prevent='clickCart'>&#xd7;</a>
    <div v-if='cart.lineItems && cart.lineItems.length'>
      <div class='line-item' v-for='item in cart.lineItems'>
          <!--<div class='clicker' @click='removeItem(item)'>X</div>--> 
          <div class='w-img'>
            <router-link :to="'/product/' + item.variant.product.id">
              <img :src='getSmall(item.variant.image.src)'>
            </router-link>
          </div>
          <div class='w-info'>
            <router-link :to="'/product/' + item.variant.product.id">
              <div class='item-title'>{{item.title}}</div>
            </router-link>
             <div class='w-inv'>
            <div class='item-quantity'>
              <span class='clicker' @click='quantity(item, -1)'>-</span>
              <span>{{item.quantity}}</span>
              <span class='clicker' @click='quantity(item, 1)'>+</span>
            </div>
          </div>
            <div class='item-variant-title'>{{item.variant.title}}</div>
            <div class='item-price'>${{item.variant.price}}</div>
          </div>
         
          <div class='clear-both'></div>
      </div>
      <div class='mb6'>
        <div class='left'>Total</div>
        <div class='right'>${{total}}</div>
        <div class='clear-both'></div>
      </div>
      <a class='checkoutButton' target='_blank' :href='cart.webUrl'>Checkout</a>
    </div>
    <div v-else>
    Cart is empty
    </div>
  </div>
</template>

<script>
export default {

  name: 'Cart',

  data () {
    return {
      specialInstructions: '',
      dontClick: false
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
    },
    checkoutId: {
      type: String,
      default: null
    }
  },
  computed: {
    count () {
      if (this.cart.lineItems && this.cart.lineItems.length) {
        var count = 0
        var items = this.cart.lineItems
        for (var i = 0; i < items.length; i++) {
          count += items[i].quantity
        }
        return count
      } else {
        return 0
      }
    },
    total () {
      if (!this.cart.lineItems) return
      var total = 0
      for (var i = 0; i < this.cart.lineItems.length; i++) {
        var item = this.cart.lineItems[i]
        total += item.quantity * parseFloat(item.variant.price)
      }
      return total.toFixed(2)
    }
  },
  methods: {
    quantity (item, amount) {
      if (this.dontClick) return
      if (item.quantity > 3 && amount > 0) return
      const lineItems = [{id: item.id, quantity: item.quantity + amount}]
      this.dontClick = true
      this.$client.checkout.updateLineItems(this.checkoutId, lineItems).then((cart) => {
        this.dontClick = false
        this.$emit('update-cart', cart)
      })
    },
    getSmall (src) {
      return src.replace('.jpg', '_small.jpg')
      // console.log(item)
      // return item.image_variants[2].src
      // var src = false
      // for (var i = 0; i < variants.length; i++) {
      //   var img = variants[i]
      //   var w = img.dimension.split('x')[0]
      //   if (parseInt(w) <= 100) {
      //     src = img.src
      //   }
      // }
      // return src
    },
    clickCart () {
      this.$emit('click-cart')
    },
    removeItem (item) {
      // this.cart.removeLineItem(item['shopify-buy-uuid']).then((cart) => {
      //   this.$emit('update-cart', cart)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../sass/vars";

#cart {
  background-color: white;
  z-index:2;
  height:100vh;
  overflow: auto;
  border-left:1px solid black;
  position:fixed;
  width:100%;
  right: -100%;
  width: 380px;
  right:-380px;
  transition: right ease 500ms;
  padding: $padding+px;
  &.open {
    right:0px;
  }
  #closeCart {
    text-transform: lowercase;
    padding:10px;
    position:absolute;
    top: 10px;
    right:10px;
  }
  .line-item {
    > div {
      display: inline-block;
      vertical-align: top;
      div {
        margin-bottom: $padding/3+px;
      }
    }
    .w-inv {
      float:right;
    }
    img {
      max-width:50px;
      margin-right: $padding/2+px;
      margin-bottom: $padding+px;
    }
  }
  .item-quantity > *{
      margin-right: 12px;
      padding:3px;
      a {
        display: inline-block;
        width: 20px;
        text-align: center;
        text-transform: lowercase;
      }
    }
  textarea {
    width:100%;
    min-height:100px;
    max-height:200px;
    max-width:100%;
  }
  .checkoutButton {
    margin-top:24px;
    height:36px;
    line-height:36px;
    color: white;
    width:100%;
    display: block;
    text-align:center;
    margin-bottom:12px;
    border: none;
    text-transform: uppercase;
    background-color: $black;
  }
}
@media only screen and (max-width : $mobile-max-width) {
// #cart {
//   width: 100vw;
//   right:-100vw;
// }

}
</style>

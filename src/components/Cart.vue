<template>
  <div id='cart' :class='{open:visible}'>
    <a href='#' @click.prevent='clickCart'>x</a>
    <div v-if='cart.attrs'>
      <div v-for='item in cart.attrs.line_items'>
        <div class='clicker' @click='removeItem(item)'>X</div>
        <pre>{{item}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Cart',

  data () {
    return {

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
  methods: {
    clickCart () {
      this.$emit('click-cart')
    },
    removeItem (item) {
      console.log('remove')
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
}
</style>

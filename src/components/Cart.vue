<template>
  <div id='cart' :class='{open:visible}'>
    <a href='#' @click.prevent='clickCart'>x</a>



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
    }
  },
  methods: {
    clickCart () {
      this.$emit('click-cart')
    }
  }
}
</script>

<style lang="scss" scoped>
#cart {
  background-color: white;
  z-index:2;
  height:100vh;
  border-left:1px solid black;
  position:fixed;
  width:100%;
  width: 320px;
  right:-320px;
  transition: right ease 500ms;
  &.open {
    right:0px;
  }
}
</style>

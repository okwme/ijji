<template>
<div>
<div width='33%' ref='productImg' v-for='product in products'>
<img :src='getImage(product)'>
{{product.attrs.title}} - {{getPrice(product)}}
<pre>{{product.attrs}}</pre></div>
</div>
</template>

<script>
export default {

  name: 'Collection',

  data () {
    return {

    }
  },
  computed: {
    currCollection () {
      return this.collections.filter((c) => {
        return this.$parent.collectionTitle(c.attrs.title) === this.id
      }).pop()
    },
    products () {
      return this.currCollection && this.currCollection.attrs.products
    }
  },
  methods: {
    getSize (index = 0) {
      console.log(window.devicePixelRatio, this.$refs.productImg)
      return window.devicePixelRatio * this.$refs.productImg[index].offsetWidth > 1024 ? '1024x1024' : 'grande'
    },
    getPrice (product) {
      return product.attrs.variants.length && product.attrs.variants[0].formatted_price
    },
    getImage (product) {
      return product.attrs.images.length && product.attrs.images[0].src.replace('.jpg', '_' + this.getSize() + '.jpg')
    }
  },
  props: {
    id: {
      type: String,
      default: 'All'
    },
    collections: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="css" scoped>
</style>

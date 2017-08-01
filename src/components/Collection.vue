<template>
  <div class='grid'>
    <div class='col-1-3 tab-1-2 mob-1-1'  v-for='product, i in products'>
      <img :src='getImage(product)'>
      {{product.attrs.title}} - {{getPrice(product)}}
      <!-- <pre>{{product.attrs}}</pre> -->
    </div>
  </div>
</template>

<script>
export default {

  name: 'Collection',

  data () {
    return {
      maxWidth: 2600,
      tabletSize: 1020,
      mobileWidth: 480,
      imageRatio: 1.5,
      padding: 12
    }
  },
  computed: {
    currCollection () {
      return this.collections.filter((c) => {
        return this.$parent.collectionTitle(c.attrs.title) === this.id
      })
    },
    products () {
      return this.currCollection.length && this.currCollection[0].attrs.products
    },
    imgSize () {
      var w = this.$parent.window > this.maxWidth ? this.maxWidth : this.$parent.window
      console.log('w', w)
      var col = w > this.tabletSize ? 3 : (w > this.mobileWidth ? 2 : 1)
      console.log('col', col)
      var long = (w / col) * window.devicePixelRatio
      console.log('long', long)
      var imgSpace = (long * this.imageRatio) - this.padding
      console.log('imgSpace', imgSpace)
      return imgSpace > 2048 ? '' : (imgSpace > 1024 ? '_2048x2048' : (imgSpace > 600 ? '_1024x1024' : (imgSpace > 480 ? '_grande' : '_large')))
    }
  },
  methods: {
    getPrice (product) {
      return product.attrs.variants.length && product.attrs.variants[0].formatted_price
    },
    getImage (product) {
      return product.attrs.images.length && product.attrs.images[0].src.replace('.jpg', this.imgSize + '.jpg')
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

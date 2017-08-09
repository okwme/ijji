<template>
  <div id='collections' class='grid'>
    <div v-if='!productsFiltered.length'>
      More products coming soon!
    </div>
    <div class='col-1-3 tab-1-2 mob-1-1'  v-for='product, i in productsFiltered'>
      <router-link :to='"/product/" + product.attrs.handle'>
        <img :src='getImage(product)'>
        {{product.attrs.title}} - {{getPrice(product)}}
        <!-- <pre>{{product.attrs}}</pre> -->
      </router-link>
    </div>
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
      })
    },
    productsFiltered () {
      return this.id === 'all' ? this.products : this.currCollection.length && this.currCollection[0].attrs.products
    },
    imgSize () {
      var w = this.$parent.window > this.$parent.maxWidth ? this.$parent.maxWidth : this.$parent.window
      // console.log('w', w)
      var col = w > this.$parent.tabletWidth ? 3 : (w > this.$parent.mobileWidth ? 2 : 1)
      // console.log('col', col)
      var long = (w / col) * window.devicePixelRatio
      // console.log('long', long)
      var imgSpace = (long * this.$parent.imageRatio) - this.$parent.padding
      // console.log('imgSpace', imgSpace)
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
    },
    products: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="css" scoped>
#collections {
  padding-top:168px;
  min-height:100vh;
}
</style>

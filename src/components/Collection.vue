<template>
  <div id='collections' class='grid'>
    <div v-if='products.length && !productsFiltered.length'>
      <h1 class='center'>More products coming soon</h1>
    </div>
    <div class='col-1-3 tab-1-2 mob-1-1'  v-for='product, i in productsFiltered'>
      <router-link :to='"/product/" + product.attrs.handle'>
        <div>
          <div class='collection-bg'
          :class="{loading: imgs[i] && !imgs[i].loaded}"
          :style="{
            'background-image':'url(' + chooseImage(i)+ ')',
            'height' : (maxHeight) + 'px'
          }"></div>
          <div>
          {{product.attrs.title}} &nbsp;–&nbsp; {{getPrice(product)}}
          </div>
        </div>
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
      imgs: []
    }
  },
  mounted () {
    this.setImgs()
  },
  computed: {
    currCollection () {
      return this.collections.filter((c) => {
        return this.$parent.collectionTitle(c.attrs.title) === this.id
      })
    },
    productsFiltered () {
      return this.id === 'all' ? this.products : !!this.currCollection.length && this.currCollection[0].attrs.products
    },
    imgSpace () {
      var w = this.$parent.window > this.$parent.maxWidth ? this.$parent.maxWidth : this.$parent.window
      console.log('w', w)
      var col = w > this.$parent.tabletWidth ? 3 : (w > this.$parent.mobileWidth ? 2 : 1)
      console.log('col', col)
      var long = (w / col) * window.devicePixelRatio
      console.log('long', long)
      return (long * this.$parent.imageRatio) - this.$parent.padding
    },
    imgSize () {
      return this.imgSpace > 2048 ? '' : (this.imgSpace > 1024 ? '_2048x2048' : (this.imgSpace > 600 ? '_1024x1024' : (this.imgSpace > 480 ? '_grande' : '_large')))
    },
    maxHeight () {
      return (this.imgSpace + this.$parent.padding) / window.devicePixelRatio
    }
  },
  watch: {
    productsFiltered () {
      this.setImgs()
    }
  },
  methods: {
    setImgs () {
      if (!this.productsFiltered) return
      this.imgs.splice(0, this.imgs.length)
      for (let product of this.productsFiltered) {
        this.imgs.push({
          url: this.getImage(product),
          small: this.getImage(product, '_small'),
          loaded: false
        })
      }
      this.loadImages()
    },
    loadImages () {
      var vm = this
      var key = this.imgs.findIndex((img) => !img.loaded)
      if (key > -1) {
        console.log(key)
        var img = this.imgs[key]
        var image = new Image()
        image.onload = function () {
          vm.imgs[key].loaded = true
          vm.loadImages()
        }
        console.log(img.url)
        image.src = img.url
      }
    },
    getPrice (product) {
      return product.attrs.variants.length && product.attrs.variants[0].formatted_price
    },
    getImage (product, size = this.imgSize) {
      return product.attrs.images.length && product.attrs.images[0].src.replace('.jpg', size + '.jpg')
    },
    chooseImage (key) {
      return this.imgs[key] && (this.imgs[key].loaded ? this.imgs[key].url : this.imgs[key].small)
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

<style lang="scss" scoped>
#collections {
  padding-top:168px;
  min-height:100vh;
  > div {
    margin-bottom:24px;
    .collection-bg {
      background-position:center top;
      background-repeat: no-repeat;
      background-size: cover;
      position:relative;
      vertical-align: bottom;
      margin-bottom:12px;
      transition: opacity 500ms ease;
      &.loading {
        opacity:0.5;
      }
    }
  }
  
}
</style>

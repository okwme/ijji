<template>
  <div id='product' class='grid'>
    <div class='col-7-12 tab-2-3 mob-1-1'>
      <div class='currentImage hide-on-desktop' :class='getClass(imageIndex)'>
        <img :src='getImg(imageIndex)'>
      </div>
      <div class='imageOptions'>
        <div v-for='(image, index) in imgs' :style='colorBorder' :class='{current: index === imageIndex}'>
          <a :href='image.src' @click.prevent.stop='imageIndex = index'>
            <img :src='getImg(index)'>
          </a>
        </div>
      </div>
      <div class='currentImage hide-on-tablet' :class='getClass(imageIndex)'>
        <img :src='getImg(imageIndex)'>
      </div>
    </div>
    <div class='col-1-12 tab-0 mob-0'></div>
    <div class='col-1-3 tab-1-3 mob-1-1 product-stats' >
      <h1>{{product && product.attrs.title}} – {{product && product.attrs.variants[0].formatted_price}}</h1>
      <div v-if='tags'>
        <span class='var-label'>Color:</span>
        <span v-for='tag in tags'>
          <router-link @click.native.stop="" v-for='link in tag' :key='link.id' :to='"/product/" + link.handle'>
            <div class='colorSwatch clicker' :class='isSelected(link)' :style='border(link.color)'>
              <div :style='bg(link.color)'></div>
            </div>
          </router-link>
        </span>
      </div>
      <div v-if='product && product.attrs.variants.length'>
        <span class='var-label'>Size:</span>
        <span v-for='variant, index in product.attrs.variants'>
          <span class='sizeVariant clicker' :class='{selected: index === variantKey}' @click.stop='variantKey = index' v-html='varSize(variant)'></span>
        </span>
      </div>
      <div >
        <span class='var-label'>Quantity:</span>
        <span class='clicker quant' @click.stop='quantity > 1 && increaseQuantity(-1)'>-</span>
        <span class='quant' v-html='quantity'></span>
        <span class='clicker quant' @click.stop='quantity < 4 && increaseQuantity(1)'>+</span>
      </div>
      <div >
        <span class='clicker' @click.stop='addToCart' v-html='buyText'></span>
      </div>
    </div>
    <div class='col-1-1'>
<!--     <pre>{{product}}</pre> -->
    </div>
  </div>
</template>

<script>
export default {

  name: 'Product',

  data () {
    return {
      imageIndex: 0,
      imgs: [],
      variantKey: 0,
      staticQuantity: 1
    }
  },
  mounted () {
    this.setImgs()
  },
  watch: {
    imageIndex () {
      if (this.imgs[this.imageIndex] && !this.imgs[this.imageIndex].loaded) {
        this.load(this.imageIndex)
      }
    },
    product () {
      if (this.product && !isNaN(this.id)) {
        this.$router.push('/product/' + this.product.attrs.handle)
      }
      this.setImgs()
    },
    imgs () {
      if (this.imgs.length) {
        this.startLoading()
      }
    }
  },
  computed: {
    buyText () {
      return !this.inCart ? 'Add To Cart' : 'Remove From Cart'
    },
    variant () {
      return this.product && this.product.attrs.variants.filter((variant, index) => {
        return index === this.variantKey
      }).pop()
    },
    inCart () {
      return this.variant && this.cart.attrs && this.cart.attrs.line_items.filter(item => {
        return item.variant_id === this.variant.id
      }).pop()
    },
    quantity () {
      return this.inCart && this.inCart.quantity || this.staticQuantity
    },
    product () {
      return this.products.filter((p) => {
        return p.attrs.product_id === parseInt(this.id) || p.attrs.handle === this.id
      }).pop()
    },
    color () {
      return this.product && this.product.attrs.tags
    },
    tags () {
      return this.product && this.product.attrs.collections && this.product.attrs.collections.map((collection) => {
        return collection.attrs.products && collection.attrs.products.map((product) => {
          return {
            color: product.attrs.tags,
            id: product.attrs.product_id,
            handle: product.attrs.handle
          }
        })
      })
    },
    colorBorder () {
      return {
        'border': '2px solid ' + this.color
      }
    }
  },
  methods: {
    increaseQuantity (amount) {
      if (this.inCart) {
        this.cart.updateLineItem(this.inCart['shopify-buy-uuid'], (this.quantity + amount))
      } else {
        this.staticQuantity += amount
      }
    },
    addToCart (e) {
      e.stopPropagation()
      if (this.inCart) {
        this.cart.removeLineItem(this.inCart['shopify-buy-uuid']).then((cart) => {
          this.$emit('update-cart', cart)
        })
      } else {
        var buy = {variant: this.product.variants[this.variantKey], quantity: this.quantity}
        this.cart.createLineItemsFromVariants(buy).then((cart) => {
          this.$emit('update-cart', cart)
          this.$emit('click-cart', true)
        })
      }
      this.staticQuantity = 1
    },
    varSize (variant) {
      return variant.option_values.filter((option) => {
        return option.name === 'Size'
      })[0].value
    },
    setImgs () {
      if (this.product && this.product.attrs.images) {
        this.imageIndex = 0
        this.imgs.splice(0, this.imgs.length)
        this.$nextTick(function () {
          this.imageIndex = 0
          this.imgs.splice(0, this.imgs.length)
          var images = this.product.attrs.images
          for (var i = 0; i < images.length; i++) {
            var img = images[i]
            this.imgs.push({
              src: img.src,
              loaded: false,
              loading: false
            })
          }
        })
      }
    },
    startLoading () {
      var key = this.imgs.findIndex((img) => {
        return !img.loading
      })
      if (key > -1) {
        this.load(key, () => {
          this.startLoading()
        })
      }
    },
    load (key, callback = function () {}) {
      var vm = this
      this.imgs[key].loading = true
      var image = this.imgs[key]
      var img = new Image()
      img.onload = function () {
        if (vm.imgs[key]) vm.imgs[key].loaded = true
        callback()
      }
      img.src = this.imgSize(image.src, this.getSize())

      var imgMed = new Image()
      imgMed.src = this.imgSize(image.src, '_medium')

      var imgSmall = new Image()
      imgSmall.src = this.imgSize(image.src, '_small')
    },
    getClass (index) {
      return {
        loading: this.imgs[index] && !this.imgs[index].loaded
      }
    },
    getImg (index) {
      if (!this.imgs[index]) return
      var main = index === this.imageIndex
      var loaded = this.imgs[index].loaded
      var src = this.imgs[index].src
      return main ? this.imgSize(src, loaded ? this.getSize() : '_medium') : this.imgSize(src, '_small')
    },
    getSize () {
      var w = this.$parent.window > this.$parent.maxWidth ? this.$parent.maxWidth : this.$parent.window
      var col = w > this.$parent.tabletWidth ? 2 : (w > this.$parent.mobileWidth ? 1.333 : 1)
      var long = (w / col) * window.devicePixelRatio
      var imgSpace = (long * this.$parent.imageRatio) - this.$parent.padding
      return imgSpace > 2048 ? '' : (imgSpace > 1024 ? '_2048x2048' : (imgSpace > 600 ? '_1024x1024' : (imgSpace > 480 ? '_grande' : '_large')))
    },
    imgSize (src, size) {
      return src.replace('.jpg', size + '.jpg')
    },
    border (hex) {
      return {
        'border': '1px solid ' + hex
      }
    },
    bg (hex) {
      return {
        'background-color': hex
      }
    },
    isSelected (link) {
      return {
        selected: link.id === parseInt(this.id) || link.handle === this.id
      }
    }
  },
  props: {
    id: {
      type: String,
      default: '404'
    },
    products: {
      type: Array,
      default: []
    },
    cart: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../sass/vars";

#product {
  padding-top:168px;
  min-height:100vh;
}
.currentImage {
  margin-right:85px;
  img {
    transition: filter ease 500ms, opacity ease 500ms;
    width:100%;
    opacity: 1;
    -webkit-filter: blur(0px); /* Safari 6.0 - 9.0 */
    filter: blur(0px);
  }
  &.loading {
    // position:relative;
    // &:after {
    //   content: 'Loading...';
    //   position: absolute;
    //   top: 20px;
    //   left:50%;
    //   transform: translateX(-50%);
    // }
    img{
      // -webkit-filter: blur(2px);
      // filter: blur(2px);
      opacity: 0.5;
    }
  }
}
.imageOptions {
  float:right;
  width: 69px;
  > div {
    height:69px;
    overflow: hidden;
    margin-bottom: 8px;
    opacity: 0.5;
    cursor: pointer;
    transition: opacity ease 500ms, border ease 500ms;

    &:not(:hover):not(.current) {
      border:2px solid transparent !important;
    }
    &:hover, &.current {
      opacity:1;
    }
  }
}
.colorSwatch {
  margin-right: 15px;
  display:inline-block;
  transition: border ease 500ms;
  margin-bottom: -6px;
  &:not(:hover):not(.selected) {
    border:1px solid transparent !important;
  }
  div {
    width: 12px;
    height:12px;
    margin:3px;
  }
}
.product-stats {
  > div {
    margin-bottom: $padding+px;
    .var-label {
      margin-right: 18px;
    }
    .quant {
      margin-right: 12px;
      padding:3px;
      &.clicker {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
    }
  }
}
.sizeVariant {
  margin: 0px 15px;
  padding:3px;
  &.selected {
    color: white;
    background-color: black;
  }
}
@media only screen and (max-width : $tablet-max-width) {

.currentImage {
  margin-right:18px;
}
.imageOptions {
  float:none;
  display: block;
  width: 100%;
  > div {
    width:50px;
    height:50px;
    display: inline-block;
  }
}

}
</style>

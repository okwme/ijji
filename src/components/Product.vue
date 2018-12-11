<template>
  <div id='product' class='grid' :class="{touchScreen: touchScreen}">
    <div class='col-7-12 tab-2-3 mob-1-1'>
      <div class='currentImage hide-on-desktop' >
        <swiper 
        :not-next-tick="true"
        :style="{'height' : (maxHeight) + 'px'}"
        class="my-swipe"
        :options="swiperOption" ref="mySwiper">
          <swiper-slide
          :key="'asdf1' + index"
          :style="{'height' : (maxHeight) + 'px'}"
          v-for="(image, index) in imgs" class="slide1">
            <div
            :class='getClass(imageIndex)'
            class='clicker slideImg'
            :style="{
              'background-image':'url(' + getImg(index) + ')',
              'height' : (maxHeight) + 'px'
            }"></div>
          </swiper-slide>
        </swiper>
      </div>
      <div class='imageOptions'>
        <div v-for='(image, index) in imgs' :style='colorBorder' :key="'asdf2' + index" :class='{current: index === imageIndex}'>
          <a :href='image.src' @click.prevent.stop='changeIndex(index)'>
            <img :src='getImg(index)'>
          </a>
        </div>
      </div>
      <div class='currentImage hide-on-tablet' :class='getClass(imageIndex)'>
        <div
        class='clicker'
        @click='incrementPhoto()'
        :style="{
          'background-image':'url(' + getImg(imageIndex) + ')',
          'height' : (maxHeight) + 'px'
        }"></div>
<!--         <img :src='getImg(imageIndex)'> -->
      </div>
    </div>
    <div class='col-1-12 tab-0 mob-0'></div>
    <div class='col-1-3 tab-1-3 mob-1-1 product-stats' >
      <h1 :style="{color: this.color + ' !important'}">{{product && product.title}} – ${{product && product.variants[0].price}}</h1>
      <div class='tags' v-if='tags'>
        <span class='var-label' :style="{color: this.color + ' !important'}">Color:</span>
        <span v-for='(tag, index) in tags' :key="'asdf3' + index">
          <router-link class='tagLink' @click.native.stop="" v-for='link in tag' :key='link.id' :to='"/product/" + link.handle'>
            <div class='colorSwatch clicker' :class='isSelected(link)' :style='border(link.color)'>
              <div :style='bg(link.color)'></div>
            </div>
          </router-link>
        </span>
      </div>
      <div class='variants' v-if='product && product.variants.length'>
        <span class='var-label' :style="{color: this.color + ' !important'}">Size:</span>
        <span v-for='variant, index in product.variants' :key="'asdf4' + index">
          <span 
          class='sizeVariant clicker'
          :style="{
            'background-color': (index === variantKey ? color : ''),
            'color': (index !== variantKey ? color : '')
          }"
          :class='{selected: index === variantKey}' 
          @click.stop='variantKey = index' 
          v-html='varSize(variant)'></span>
        </span>
      </div>
      <div 
      :class="{hide:  variant && !variant.available}"
      class='quantity'>
        <span class='var-label' :style="{color: this.color + ' !important'}"><span class='hide-on-mobile'>Quantity:</span><span class='hide-on-desktop hide-on-tablet show-on-mobile'>Qty:</span></span>
        <span 
        :style="{color: this.color + ' !important'}"
        class='clicker quant' @click.stop='quantity > 1 && increaseQuantity(-1)'>-</span>
        <span 
        :style="{color: this.color + ' !important'}"
        class='quant' v-html='quantity'></span>
        <span 
        :style="{color: this.color + ' !important'}"
        class='clicker quant' @click.stop='quantity < 4 && increaseQuantity(1)'>+</span>
      </div>
      <div class='buy-div'
      :class="{full:   variant && !variant.available}">
        <span
        :style="{'background-color': this.color }"
        id='addToCart' 
        :class="{BIS_trigger: variant && !variant.available}"
        class='clicker'
        :data-product-data="BIS" 
        @click.prevent='addToCart'
        v-html='buyText'></span>
      </div>
      <div @click='measurements = 1' class='measurements-button' :style="{border: '2px solid ' + this.color, color: this.color + ' !important'}">Measurements</div>
      <div class='text-div'>
        <!-- <div class='textChoices'>
          <span
          class='clicker'
          :style="{
            'color': textView === 0 ? 'white' : this.color,
            'background-color': textView === 0 ? this.color : ''}"
          @click='textView = 0'>Details</span>
        </div> -->
        <div
        :style="{color: this.color + ' !important'}" v-html='showDescription'></div>
        <!-- <div v-html='showMeasurements' style='display: none'></div> -->
        <transition name="fade-in">
        <div class='measurements-modal' @click='measurements = 0' v-if='measurements == 1'>
          <div @click='measurements = 1'>
            <div v-html='showImage' class="measurements-modal-img"></div>
            <!-- <div class='hide-mobile col-1-12 mob-0-0'></div> -->
            <!-- <div class='col-4-12 mob-1-1 measurements-modal-text' v-html='showMeasurements' :style="{color: this.color + ' !important'}"></div> -->
            <div class='col-1-12 measurements-modal-x' @click='measurements = 0'><img src="https://icongr.am/feather/x.svg?color=111111"/></div>
          </div>
        </div>
        </transition>
      </div>
    </div>
    <div class='col-1-1'>
<!--     <pre>{{product}}</pre> -->
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {

  name: 'Product',

  data () {
    return {
      measurements: 0,
      imageIndex: 0,
      imgs: [],
      variantKey: 2,
      staticQuantity: 1,
      // showBIS: true,
      swiperOption: {
        initialSlide: 1,
        direction: 'horizontal',
        loop: true,
        loopedSlides: 1,
        onSlideChangeEnd: (swiper) => {
          var foo = (swiper.activeIndex - 1) % this.imgs.length
          this.imageIndex = foo < 0 ? this.imgs.length - 1 : foo
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted () {
    this.setImgs()
    this.$emit('color-change', this.color)
  },
  destroyed () {
    this.$emit('color-change', null)
  },
  watch: {
    imageIndex () {
      if (this.imgs[this.imageIndex % this.imgs.length] && !this.imgs[this.imageIndex % this.imgs.length].loaded) {
        this.load(this.imageIndex % this.imgs.length)
      }
    },
    product () {
      console.log('product debug', this.product)
      if (this.product && !isNaN(this.id)) {
        this.$router.push('/product/' + this.product.handle)
      }
      this.setImgs()
    },
    imgs () {
      if (this.imgs.length) {
        this.$nextTick(function () {
          this.startLoading()
        })
      }
    },
    color () {
      this.$emit('color-change', this.color)
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    BIS () {
      if (!this.product) return
      var item = JSON.parse(JSON.stringify(this.product))
      try {
        var decodedData = window.atob(item.id)
        item.id = decodedData.split('/').pop()
      } catch (error) {
        console.log(error)
        return
      }
      item.options = item.options.map(o => {
        try {
          decodedData = window.atob(o.id)
          o.id = decodedData.split('/').pop()
          return o
        } catch (error) {
          console.log(error)
          return
        }
      })
      var v = JSON.parse(JSON.stringify(this.variant))
      try {
        decodedData = window.atob(v.id)
        v.id = decodedData.split('/').pop()
      } catch (error) {
        console.log(error)
        return
      }

      if (!v.available) v.inventory_quantity = 0
      v.inventory_management = 'shopify'
      v.selectedOptions.map((option, index) => {
        v['option' + (index + 1)] = option.value
        return option.value
      })
      v.option = v.selectedOptions
      item.variants = [v]
      return JSON.stringify(item)
    },
    // showMeasurements () {
    //   if (!this.product) return
    //   if (this.measurements === 1) {
    //     document.body.className = 'modalOpen'
    //     return '<table' + this.product.descriptionHtml.split('<table')[1].split('<img')[0]
    //   } else if (this.measurements === 0) {
    //     document.body.className = ''
    //   }
    // },
    showImage () {
      return this.product.descriptionHtml.split('<table')[0].split('<img')[1] ? '<img' + this.product.descriptionHtml.split('<table')[0].split('<img')[1] : 'no measurements available'
    },
    showDescription () {
      return this.product && this.product.descriptionHtml.split('<table')[0].split('<img')[0]
    },
    buyText () {
      return this.variant && (!this.variant.available ? 'email me when it\'s back' : (!this.inCart ? 'Add To Cart' : 'Remove From Cart'))
    },
    variant () {
      return this.product && this.product.variants.filter((variant, index) => {
        return index === this.variantKey
      }).pop()
    },
    inCart () {
      return this.variant && this.cart.lineItems && this.cart.lineItems.filter(item => {
        return item.variant_id === this.variant.id // come back here
      }).pop()
    },
    quantity () {
      return this.inCart && this.inCart.quantity || this.staticQuantity
    },
    product () {
      return this.products.filter((p) => {
        return p.id === this.id || p.handle === this.id
      }).pop()
    },
    collection () {
      return this.collections.filter((c) => c.products.find((p) => p.id === this.product.id) && c.title.split('-').length > 1)
    },
    colorcollection () {
      return this.products.filter((p) => p.title.split('-')[0] === this.product.title.split('-')[0])
    },
    color () {
      return this.product && this.product.tags && this.product.tags[0].value
    },
    tags () {
      return [this.colorcollection.map(product => {
        return {
          color: product.tags,
          id: product.id,
          handle: product.handle
        }
      })]
    },
    colorBorder () {
      return {
        'border': '2px solid ' + this.color
      }
    },
    // imgSpace () {
    //   var w = this.$parent.window + (this.$parent.padding * 3) > this.$parent.maxWidth ? this.$parent.maxWidth : this.$parent.window
    //   w += this.$parent.padding * 3
    //   var col = w > this.$parent.tabletWidth ? 0.5 : (w > this.$parent.mobileWidth ? 0.66 : 1)
    //   w -= (this.$parent.padding * 4)
    //   var long = ((w * col) - this.$parent.padding) * window.devicePixelRatio
    //   return long / this.$parent.imageRatio
    // },
    imgSpace () {
      var w = this.$parent.window > this.$parent.maxWidth ? this.$parent.maxWidth : this.$parent.window
      var col = false
      if (w <= (this.$parent.mobileWidth)) {
        col = 1
        w -= (this.$parent.padding * 3)
      } else if (w <= (this.$parent.tabletWidth)) {
        col = 0.6666
        w -= (this.$parent.padding * 4)
      } else if (w <= (this.$parent.desktopWidth)) {
        col = 0.5
        w -= (this.$parent.padding * 4)
      } else {
        col = 0.5
      }
      var long = (((w * col) - this.$parent.padding) * window.devicePixelRatio)
      if (col === 0.6666) {
        long -= 10
      }
      return long / this.$parent.imageRatio
    },
    maxHeight () {
      return this.imgSpace / window.devicePixelRatio
    }
  },
  methods: {
    changeIndex (index) {
      this.imageIndex = index
      this.swiper.slideTo(this.imageIndex + 1)
    },
    incrementPhoto () {
      var foo = this.imageIndex + 1
      this.imageIndex = foo % this.imgs.length
    },
    increaseQuantity (amount) {
      if (this.inCart) {
        this.cart.updateLineItem(this.inCart['shopify-buy-uuid'], (this.quantity + amount))
      } else {
        this.staticQuantity += amount
      }
    },
    addToCart (e) {
      if (!this.variant.available) return true
      e.stopPropagation()
      if (this.inCart) {
        this.cart.removeLineItem(this.inCart['shopify-buy-uuid']).then((cart) => {
          this.$emit('update-cart', cart)
        })
      } else {
        var buy = {variantId: this.product.variants[this.variantKey].id, quantity: this.quantity}
        this.$client.checkout.addLineItems(this.checkoutId, buy).then((cart) => {
          this.$emit('update-cart', cart)
          this.$emit('click-cart', true)
        })
      }
      this.staticQuantity = 1
    },
    varSize (variant) {
      return variant.selectedOptions.filter((option) => {
        return option.name === 'Size'
      })[0].value
    },
    setImgs () {
      if (this.product && this.product.images) {
        this.imageIndex = 0
        this.imgs.splice(0, this.imgs.length)
        this.$nextTick(function () {
          this.imageIndex = 0
          this.imgs.splice(0, this.imgs.length)
          var images = this.product.images
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
      imgSmall.src = this.imgSize(image.src, '_medium')
    },
    getClass (index) {
      return {
        loading: this.imgs[index] && !this.imgs[index].loaded
      }
    },
    getImg (index) {
      if (!this.imgs[index]) return
      var next = (this.imageIndex + 1) % this.imgs.length
      var prev = (this.imageIndex - 1)
      prev = prev < 0 ? this.imgs.length - 1 : prev
      var main = index === this.imageIndex || index === next || index === prev
      var loaded = this.imgs[index].loaded
      var src = this.imgs[index].src
      // console.log(this.imageIndex, index, main, next, prev)
      return main || loaded ? this.imgSize(src, loaded ? this.getSize() : '_medium') : this.imgSize(src, '_medium')
    },
    getSize () {
      return this.imgSpace > 2048 ? '' : (this.imgSpace > 1024 ? '_2048x2048' : (this.imgSpace > 600 ? '_1024x1024' : (this.imgSpace > 480 ? '_grande' : '_large')))
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
      if (this.id && this.color) {
        return {
          selected: link.id === this.id || link.handle === this.id || link.color[0].value === this.color
        }
      }
    }
  },
  props: {
    touchScreen: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '404'
    },
    products: {
      type: Array,
      default: []
    },
    collections: {
      type: Array,
      default: []
    },
    cart: {
      type: Object,
      default: {}
    },
    checkoutId: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" >
@import "../sass/vars";

.fade-in-enter-active {
  transition: all .4s ease;
}
.fade-in-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-in-enter, .fade-in-leave-to {
  opacity: 0;
}

#product {
  padding-top:168px;
  min-height:80vh;
  .invisible {
    position:absolute;
    width:0px;
    height:0px;
    visibility: hidden;
  }
}
.currentImage {
  margin-right:90px;
  > div, .slideImg {
    transition: opacity ease 500ms;
    width:100%;
    opacity: 1;
    // -webkit-filter: blur(0px); 
    // filter: blur(0px);
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    &.loading {
      opacity: 0.5;
    }
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
    > div{
      // -webkit-filter: blur(2px);
      // filter: blur(2px);
      opacity: 0.5;
    }
  }
}
.touchScreen .imageOptions > div:hover {
    opacity: inherit;
}
.modalOpen {
  overflow: hidden;
}
.imageOptions {
  float:right;
  width: 69px;
  > div {
    height:69px;
    overflow: hidden;
    margin-bottom: 12px;
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
.tags span:last-of-type a:last-of-type .colorSwatch {
  margin-right:0px;
}
a.tagLink:hover {
  font-weight:normal;
}

.touchScreen .colorSwatch:not(:hover) {
    border: inherit;
}
.colorSwatch {
  margin-right: 14px;
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
  h1 {
    margin: 7px 0px 24px 0px;
  }
  > div {
    margin-bottom: 24px;
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
  margin: 0px 18px 0px 0px;
  padding:3px;
  &.selected {
    color: white;
  }
}
.measurements-button {
  display: inline-block;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
  text-align: center;
  line-height: 36px;
}
.measurements-modal {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  overflow: hidden;
  background: rgba(255,255,255,.8);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;  
  >div {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid black;
    width: 60%;
    height: 80%;
    position: relative;
  }
  &-img {
    height: 100%;
    display: flex;
    img {
      height: 100%;
    }
  }
  &-x {
    align-self: flex-start;
    text-align:right;
    padding: 15px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
}
.variants span:last-of-type .sizeVariant {
  margin-right:0;
}
#addToCart {
  height:36px;
  line-height:36px;
  color: white;
  width:100%;
  display: block;
  text-align:center;
  margin-bottom:24px;
  text-transform: uppercase;
}
.textChoices {
  span {
    padding:3px;
    margin-right: 15px;
    text-transform: uppercase;
    * {
      font-size:12px;
    }
  }
  margin-bottom:15px;
}

@media only screen and (max-width : $tablet-max-width) {
  #product {
    margin-bottom:48px;
  }
  .currentImage {
    margin-right:18px;
    margin-bottom:12px;
  }
  .imageOptions {
    float:none;
    display: block;
    width: 100%;
    > div {
      width:50px;
      height:50px;
      display: inline-block;
      margin-right:12px;
      margin-bottom:12px;
      &:not(.current) {
        border:2px solid transparent !important;
      }
    }
  }
}
@media only screen and (max-width : $mobile-max-width) {
  .hidemobile {
    display: none !important;
  }
  #product {
    padding-top:204px;
  }
  .currentImage{
    margin-right:0px;
  }
  .imageOptions {
    > div {
      width:36px;
      height:36px;
    }
  }
  .measurements-modal {
    >div {
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: space-around;
    }
    &-x {
        padding: 0;
        position: absolute;
        top: 20px;
        right: 16px;
    }
    &-img {
      display: block;
      height: initial;
      img {
        height: initial;
      }
    }
    &-text {
      text-align: center;
    }
  }
  .colorSwatch {
    margin-right:10px;
  }
  .product-stats {
    > div .var-label {
      margin-right: 10px;
    }
    h1 {
      margin-top:36px;
    }
    .text-div {
      margin-bottom:0px;
    }
    .sizeVariant{
      margin-right:12px;
    }
    .quantity, .buy-div {
      position:fixed;
      bottom:0px;
      background-color: white;
      margin-bottom:0px;
    }
    .quantity {
      transition: 500ms ease left;
      left:0px;
      width: 100%;
      height:60px;
      line-height:60px;
      padding-left:18px;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
      z-index:3;
      &.hide > *{
        display: none !important;
      }
      .var-label{
        margin-right:12px;
      }
    }
    .buy-div {
      transition: 500ms ease right;
      right: 18px;
      bottom:12px;
      width:206px;
      z-index:3;
      &.full {
        width:calc(100% - 36px);
      }
      #addToCart {
        margin-bottom:0px;
      }
    }
  }
  &.cartVisible {
    .quantity {
      left:-380px;
    }
    .buy-div {
      right: 398px;
    }
  }
}
</style>

<template>
  <div id='toolbar'>
    <div class='grid'>
      <div class='col-1-3 mob-1-1'>
        <router-link to="/" id='index'><img id='logo' src="../assets/Logo.svg"></router-link>
      </div>
      <div class='col-2-3 mob-1-1'>
        <transition name="delay">
          <div v-if="logoCollection" class='collections'>
            <!-- <router-link
            :style='colorStyle'
            data-text='All'
            to="/collections/all">All</router-link> -->
            <router-link
            :style='colorStyle'
            :data-text='$parent.collectionTitle(collection.title)'
            :key='collection.title' 
            v-for='collection in productCollections' 
            :to="'/collections/' + $parent.collectionTitle(collection.title)"
            v-html='$parent.collectionTitle(collection.title)'>
            </router-link>
            <a 
            :style='colorStyle'
            :data-text="'Cart ' + (items ? '(' + items + ')' : '')"
            href='#' @click.prevent='clickCart'>Cart {{items ? '(' + items + ')' : ''}}</a>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Toolbar',

  mounted () {
    this.$emit('color-change', this.color)
  },
  destroyed () {
    this.$emit('color-change', null)
  },
  computed: {
    colorStyle () {
      console.log(this.NavColor)
      return {
        color: this.color || (this.$route.name === 'Home' && this.NavColor.description) || (this.$route.name === 'Collection' && '#111111')
      }
    },
    logoCollection () {
      return this.collections.filter((collection) => {
        return collection.title === 'Logo'
      }).pop()
    },
    NavColor () {
      return this.collections.filter((collection) => {
        return collection.title === 'Nav Color'
      }).pop()
    },
    logo () {
      return this.logoCollection && this.logoCollection.image.src
    },
    items () {
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
    }
  },
  watch: {
    color () {
      this.$emit('color-change', this.color)
    }
  },
  methods: {
    clickCart (e) {
      e.stopPropagation()
      this.$emit('click-cart')
    }
  },
  props: {
    color: {
      type: String,
      default: null
    },
    checkoutId: {
      type: String,
      default: null
    },
    cartVisible: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Object,
      default: {}
    },
    collections: {
      type: Array,
      default: []
    },
    productCollections: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../sass/vars";
  .delay-display-none-leave-active {
    transition: opacity;
    transition-delay: 5000ms;
    transition-duration: 0;
  }
  .delay-display-none-leave-to {
      opacity: 1
  }
  #logo:hover {
    filter: invert(1);
  }
  #toolbar {
    position:absolute;
    width:100%;
    left:0px;
    top:0px;
    margin-top:48px;
    z-index:2;
    #index {
      float: left;
      img{
        max-width:141px;
      }
    }
    .collections {
      float:right;
      a {
        display: inline-block;
        margin-right: 18px;
        padding:3px;
        text-transform: uppercase;
        &:last-of-type {
          margin-right:0;
        }
        &.router-link-active{
          background-color: $black;
          color: white !important;
        }
      }
      a::after {
        display:block;
        content:attr(data-text);
        font-weight:bold;
        height:1px;
        color:transparent;
        overflow:hidden;
        visibility:hidden;
      }
    }
  }
  @media only screen and (max-width : $mobile-max-width) {
    #toolbar {
      #index{
        float: none;
        img {
          margin: auto;
          display: block;
          margin-bottom: 24px;
        }
      }

      .collections {
        float:none;
        text-align:center;
        a {
          margin:0px 9px;
          &:first-of-type{
            margin-left:0px;
          }
          &:last-of-type {
            margin-right:0px;
          }
        }
      }
    }
  }
</style>

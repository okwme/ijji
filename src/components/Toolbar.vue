<template>
  <div id='toolbar'>
    <div class='grid'>
      <div class='col-1-3'>
        <router-link to="/" id='index'><img id='logo' :src='logo'></router-link>
      </div>
      <div class='col-2-3'>
        <div class='collections'>
          <router-link
          data-text='All'
          to="/collections/all">All</router-link>
          <router-link
          :data-text='$parent.collectionTitle(collection.attrs.title)'
          :key='collection.attrs.title' 
          v-for='collection in productCollections' 
          :to="'/collections/' + $parent.collectionTitle(collection.attrs.title)"
          v-html='$parent.collectionTitle(collection.attrs.title)'>
          </router-link>
          <a 
          :data-text="'Cart ' + (items ? '(' + items + ')' : '')"
          href='#' @click.prevent='clickCart'>Cart {{items ? '(' + items + ')' : ''}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Toolbar',

  data () {
    return {

    }
  },
  computed: {
    logoCollection () {
      return this.collections.filter((collection) => {
        return collection.attrs.title === 'Logo'
      }).pop()
    },
    logo () {
      return this.logoCollection && this.logoCollection.attrs.image.src
    },
    items () {
      if (this.cart.attrs && this.cart.attrs.line_items.length) {
        var count = 0
        var items = this.cart.attrs.line_items
        for (var i = 0; i < items.length; i++) {
          count += items[i].quantity
        }
        return count
      } else {
        return 0
      }
    }
  },
  methods: {
    clickCart (e) {
      e.stopPropagation()
      this.$emit('click-cart')
    }
  },
  props: {
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
  #toolbar {
    position:absolute;
    width:100%;
    left:0px;
    top:0px;
    margin-top:48px;

    #index {
      float: left;
      img{
        width:140px;
      }
    }
    .collections {
      float:right;
      a {
        display: inline-block;
        margin-right: 24px;
        text-transform: uppercase;
        &:last-of-type {
          margin-right:0;
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
</style>

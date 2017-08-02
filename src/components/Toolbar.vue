<template>
  <div id='toolbar'>
    <div class='grid'>
      <router-link to="/" id='index'><img :src='logo'></router-link>
      <div class='collections'>
        <router-link to="/collections/all">All</router-link>
        <router-link
         :key='collection.attrs.title' v-for='collection in productCollections' :to="'/collections/' + $parent.collectionTitle(collection.attrs.title)">{{$parent.collectionTitle(collection.attrs.title)}}</router-link>
        <a href='#' @click.prevent='clickCart'>Cart {{items ? '(' + items.length + ')' : ''}}</a>
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
      return this.cart && this.cart.attrs && this.cart.attrs.line_items
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
    margin-top:45px;
    #index {
      float: left;
    }
    .collections {
      float:right;
    }
  }
</style>

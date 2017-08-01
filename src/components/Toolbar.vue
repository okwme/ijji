<template>
  <div>
    <router-link to="/"><img :src='logo'></router-link>
    <div class='collections'>
      <router-link to="/collections/all">All</router-link>
      <router-link
       :key='collection.attrs.title' v-for='collection in productCollections' :to="'/collections/' + $parent.collectionTitle(collection.attrs.title)">{{$parent.collectionTitle(collection.attrs.title)}}</router-link>
      <a href='#' @click.prevent='showCart()'>Cart {{items ? '(' + items.length + ')' : ''}}</a>

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
    showCart () {
      console.log('show cart')
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

<style lang="sass" scoped>
</style>

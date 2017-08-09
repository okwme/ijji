<template>
  <div>
    <div class='banner grid' >
      <div class='col-1-1' v-html='banner && banner.attrs.body_html'>
      </div>
    </div>
    <div class='grid'>
      <div class='collections col-1-6'>
        <div v-for='collection in productCollections'>
          <router-link :to="'/collections/' + $parent.collectionTitle(collection.attrs.title)">{{$parent.collectionTitle(collection.attrs.title)}}</router-link>
        </div>
      </div>
      <div class='links col-1-6'>
        <div v-for='collection in navCollections'>
          <router-link :to="'/collections/' + collection">{{collection}}</router-link>
        </div>
      </div>
      <div class='links col-1-6' v-html='social && social.attrs.body_html'></div>
      <div class='mailchimp col-5-12' v-html='mailchimp && mailchimp.attrs.body_html'></div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Bottom',

  data () {
    return {

    }
  },
  computed: {
    navCollections () {
      return ['About', 'Contact', 'Shipping', 'Returns']
      // return this.collections && this.collections.filter((collection) => {
      //   console.log(collection.attrs.title)
      //   var found = names.findIndex((name) => {
      //     return collection.attrs.title === name
      //   })
      //   console.log(found)
      //   return found > -1
      // })
    },
    banner () {
      return this.collections && this.collections.filter((collection) => {
        return collection.attrs.title === 'Banner'
      }).pop()
    },
    social () {
      return this.collections && this.collections.filter((collection) => {
        return collection.attrs.title === 'Social Links'
      }).pop()
    },
    mailchimp () {
      return this.collections && this.collections.filter((collection) => {
        return collection.attrs.title === 'Mailchimp'
      }).pop()
    }
  },
  props: {
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
.banner {
  margin-top:72px;
  margin-bottom:37px;
  text-align:center;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>

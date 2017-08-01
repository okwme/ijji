<template>
  <div>
    <div v-html='banner && banner.attrs.body_html'></div>

    <div class='collections'>
      <router-link  :key='collection.attrs.title' v-for='collection in productCollections' :to="'/collections/' + $parent.collectionTitle(collection.attrs.title)">{{$parent.collectionTitle(collection.attrs.title)}}</router-link>
    </div>
    <div class='links' v-html='social && social.attrs.body_html'></div>
    <div class='mailchimp' v-html='mailchimp && mailchimp.attrs.body_html'></div>
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

<style lang="css" scoped>
</style>

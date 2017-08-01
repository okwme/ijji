<template>
  <div>
    <div v-html='banner && banner.attrs.body_html'></div>

    <div class='collections'>
      <router-link v-for='collection in productCollections' :key='collection.attrs.title.value' :to="'/collections/' + collectionTitle(collection.attrs.title.value)">{{collectionTitle(collection.attrs.title.value)}}</router-link>
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
        return collection.attrs.title.value === 'Banner'
      }).pop()
    },
    social () {
      return this.collections && this.collections.filter((collection) => {
        return collection.attrs.title.value === 'Social Links'
      }).pop()
    },
    mailchimp () {
      return this.collections && this.collections.filter((collection) => {
        return collection.attrs.title.value === 'Mailchimp'
      }).pop()
    }
  },
  methods: {
    collectionTitle (title) {
      var chunk = title.split('-')
      chunk.shift()
      return chunk.join('-')
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

<template>
  <div>
    <img :src='landingImg'>
  </div>
</template>

<script>
export default {

  name: 'Home',

  data () {
    return {

    }
  },
  props: {
    collections: {
      type: Array,
      default: []
    }
  },
  computed: {
    landing () {
      return this.collections.filter((collection) => {
        return collection.attrs.title === 'Landing'
      }).pop()
    },
    landingImg () {
      return this.landing && this.landing.attrs && this.landing.attrs.image && this.landing.attrs.image.src
    }
  }
}
</script>

<style lang="css" scoped>
</style>

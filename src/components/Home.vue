<template>
  <div id='home' :style='bg'></div>
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
    bg () {
      return {
        'background-image': 'url(\'' + this.landingImg + '\')'
      }
    },
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
  #home {
    min-height:100vh;
    background-size: cover;
    background-position:center center;
    background-repeat:no-repeat;
  }
</style>

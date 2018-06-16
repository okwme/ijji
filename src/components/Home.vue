<template>
  <div id='home' :style='bg' :class="{loading: !imgLoaded}"></div>
</template>

<script>
export default {

  name: 'Home',

  data () {
    return {
      imgLoaded: false
    }
  },
  props: {
    collections: {
      type: Array,
      default: []
    }
  },
  mounted () {
    this.loadImg()
  },
  watch: {
    landing () {
      this.loadImg()
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
        return collection.title === 'Landing'
      }).pop()
    },
    landingImg () {
      return this.landing && (this.imgLoaded ? this.landing.image.src : this.landing.image.src.replace('.jpg', '_small.jpg'))
    }
  },
  methods: {
    loadImg () {
      if (!this.imgLoaded && this.landing) {
        var img = new Image()
        img.onload = () => {
          this.imgLoaded = true
        }
        img.src = this.landing.image.src
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../sass/vars";

  #home {
    min-height:100vh;
    background-size: cover;
    background-position:center center;
    background-repeat:no-repeat;
    transition: opacity 500ms ease;
    &.loading {
      opacity:0.5;
    }
  }
@media only screen and (max-width : $tablet-max-width) {
  #home {
    margin-bottom: 72px;

  }
}
@media only screen and (max-width : $mobile-max-width) {
  #home {
    background-position: 40% 0%;
    background-size: 340%;
  }
}
</style>

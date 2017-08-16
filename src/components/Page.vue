<template>
<div id='page' class='grid'>
  <div class='col-1-1'>
    <div class='page' v-if='collections.length && !currPage'>
      <h1>Sorry, page not found (404)</h1>
    </div>
    <div class='page' v-if='collections.length && currPage'>
      <h1 class='center'>{{id}}</h1>
      <div  v-html='currPage.attrs.body_html'></div>
    </div>
  </div>
</div>
</template>

<script>
export default {

  name: 'Page',

  data () {
    return {

    }
  },
  computed: {
    currPage () {
      return this.collections.filter((c) => {
        return c.attrs.title === this.id
      }).pop()
    }
  },
  props: {
    id: {
      type: String,
      default: 'All'
    },
    collections: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="scss">
#page {
  min-height:400px;
  .page {
    max-width: 403px;
    margin:222px auto 48px auto;
    h1 {
      text-align: center;
      margin-top:120px;
      margin-bottom:60px;
    }
    a {
      text-transform: none;
      text-decoration: underline;
      &:hover {
        font-weight: normal;
      }
    }
  }
}
</style>

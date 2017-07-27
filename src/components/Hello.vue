<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <div>
      <a class='BIS_trigger' data-product-data='{"id":9583325579,"tags":[],"variants":[
      {"id":35151828427,"title":"XS \/ Natural","option1":"XS","option2":"Natural","option3":null,"sku":"232","available":false,"public_title":"XS \/ Natural","options":["XS","Natural"],"inventory_quantity":0,"inventory_management":"shopify"},
      {"id":35151828555,"title":"S \/ Natural","option1":"S","option2":"Natural","option3":null,"sku":"235","available":false,"public_title":"S \/ Natural","options":["S","Natural"],"inventory_quantity":0,"inventory_management":"shopify"},
      {"id":35151828619,"title":"M \/ Natural","option1":"M","option2":"Natural","option3":null,"sku":"238","available":false,"public_title":"M \/ Natural","options":["M","Natural"],"inventory_quantity":0,"inventory_management":"shopify"},      
      {"id":35151828747,"title":"L \/ Natural","option1":"L","option2":"Natural","option3":null,"sku":"241","available":false,"public_title":"L \/ Natural","options":["L","Natural"],"inventory_quantity":0,"inventory_management":"shopify"}]}' href='#'>buy later</a>
      <a></a>
    </div>
    <div v-html="md('pages/home.md')"></div>
    <div v-for='product in products'>
      <a class='BIS_trigger' :data-product-data='stringify(product.attrs)' href='#'>{{product.attrs.title.value}}</a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
  },
  props: {
    products: {
      type: Array,
      default: []
    }
  },
  methods: {
    md (name) {
      console.log(name)
      var page = require('../' + name)
      return page
    },
    stringify (string) {
      string = JSON.parse(JSON.stringify(string))
      Object.keys(string).map((key, index) => {
        if (key && string[key].value) {
          console.log(key)
          console.log(string[key])
          string[key] = string[key].value
        }
        // string[key] = string[key].value
      })
      string['id'] = 9583325579
      return JSON.stringify(string)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

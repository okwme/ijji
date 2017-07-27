<template>
  <div>
    <div v-for='product in productsMapped'>
      <a class='BIS_trigger' :data-product-data='stringify(product)' href='#'>{{product.title}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  computed: {
    productsMapped () {
      return this.products.map((product) => {
        var item = product.attrs
        item.id = item.product_id
        for (var i = 0; i < item.variants.length; i++) {
          var variant = item.variants[i]
          if (!variant.available) variant.inventory_quantity = 0
          // variant.inventory_quantity = 0
          variant.inventory_management = 'shopify'
          variant.option_values.map((option, index) => {
            variant['option' + (index + 1)] = option.value
            return option.value
          })
          variant.option = variant.option_values
          item.variants[i] = variant
        }
        return item
      })
    }
  },
  props: {
    products: {
      type: Array,
      default: []
    }
  },
  methods: {
    stringify (item) {
      return JSON.stringify(item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

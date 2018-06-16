// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Client from 'shopify-buy'

const client = Client.buildClient({
  domain: 'ijjico.myshopify.com',
  storefrontAccessToken: 'bb500e2b8aadb0af601f7aa9e0cc7292'
})

// var ShopifyBuy = require('../node_modules/shopify-buy/dist/shopify-buy.umd.min.js')

// var client = ShopifyBuy.buildClient({
//   accessToken: 'bb500e2b8aadb0af601f7aa9e0cc7292',
//   appId: 6,
//   domain: 'ijjico.myshopify.com'
// })

// var client = ShopifyBuy.buildClient({
//   accessToken: '6913fc35300008e6bbd8b5bd714b86ac',
//   appId: 6,
//   domain: 'ijji-store.myshopify.com'
// })
Object.defineProperty(Vue.prototype, '$client', { value: client })

var debounce = require('debounce')
Object.defineProperty(Vue.prototype, '$debounce', { value: debounce })

Vue.config.productionTip = false

require('swiper/dist/css/swiper.css')
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

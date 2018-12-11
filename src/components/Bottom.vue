<template>
  <div id='footer'>
    <div class=' grid' >
      <div class='col-1-1'>
        <div class='banner ' v-html='banner && banner.descriptionHtml'></div>
      </div>
    </div>
    <div class='grid'>
      <div class='collections col-1-6 mob-1-3'>
        <div v-for='collection in productCollections'>
          <router-link :to="'/collections/' + $parent.collectionTitle(collection.title)">{{$parent.collectionTitle(collection.title)}}</router-link>
        </div>
      </div>
      <div class='links col-1-6 mob-1-3'>
        <div v-for='nav in navs'>
          <router-link :to="'/pages/' + nav">{{nav}}</router-link>
        </div>
      </div>
      <div class='links col-1-6 mob-1-3' v-html='social && social.descriptionHtml'></div>
      <div class='col-2-12 tab-0'>&nbsp;</div>
      <div @click='handleClick()' class='newsletter col-4-12 tab-1-2 mob-1-1'>Get 10% Off Your First Order</div>
      <transition name="modal">
        <div v-if='popopen' class='mailchimp col-5-12 tab-1-2 mob-1-1' v-html='mailchimp && mailchimp.descriptionHtml'></div>
      </transition>
      <transition name="modal">
        <img v-if='popopen' @click='close()' class="newsletter-close" src="https://icongr.am/feather/x.svg?color=111111">
      </transition>
    </div>
    <transition name="modal">
      <div class="newsletter-spacer" v-if='popopen'></div>
    </transition>
  </div>
</template>

<script>
export default {

  name: 'Bottom',

  data () {
    return {
      popover: 0,
      scrolled: false
    }
  },
  computed: {
    navs () {
      return ['About', 'Contact', 'Shipping', 'Returns', 'Privacy', 'Terms of Service']
      // return this.collections && this.collections.filter((collection) => {
      //   console.log(collection.title)
      //   var found = names.findIndex((name) => {
      //     return collection.title === name
      //   })
      //   console.log(found)
      //   return found > -1
      // })
    },
    banner () {
      return this.collections && this.collections.filter((collection) => {
        return collection.title === 'Banner'
      }).pop()
    },
    social () {
      return this.collections && this.collections.filter((collection) => {
        return collection.title === 'Social Links'
      }).pop()
    },
    mailchimp () {
      return this.collections && this.collections.filter((collection) => {
        return collection.title === 'Mailchimp_dev'
      }).pop()
    },
    popopen () {
      return this.popover === 1 || this.scrolled
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
  },
  methods: {
    mobileCheck () { return navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) },
    handleScroll () {
      if (window.scrollY > 0 && this.mailchimp) this.scrolled = true
      if (this.mailchimp && this.mobileCheck()) document.querySelector('#mc-embedded-subscribe').value = 'Go'
      if (this.mailchimp) document.querySelector('#mc-embedded-subscribe-form').addEventListener('submit', () => this.close())
    },
    handleClick () {
      this.popover = 1
      if (this.mobileCheck()) setTimeout(function () { document.querySelector('#mc-embedded-subscribe').value = 'Go' }, 5)
    },
    close () {
      window.removeEventListener('scroll', this.handleScroll)
      this.popover = 0
      this.scrolled = false
    }
  },
  created () {
    if (this.$router.currentRoute.name === 'Collection' || this.$router.currentRoute.name === 'Home') { window.addEventListener('scroll', this.handleScroll) }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss">
  @import "../sass/vars";
  .modal-enter-active {
    transition: all .5s ease;
  }
  .modal-leave-active {
    transition: all .5s ease;
  }
  .modal-enter, .modal-leave-to {
    opacity: 0.3;
    transform: translateY(200px);
  }
  #footer {
    margin-bottom: 96px;
    .banner {
      margin-top:72px;
      margin-bottom:37px;
      text-align:center;
      border-top: 1px solid $black;
      border-bottom: 1px solid $black;

      p {
        margin:17px 0px;
      }
    }
    .collections, .links {
      margin-top: 24px;
      a {
        display:inline-block;
        margin-bottom:6px;
        padding:3px;

        &.router-link-active{
          background-color: $black;
          color: white;
        }
      }
    }
    .mailchimp {
      z-index: 99;
      width: 100vw;
      display: flex;
      justify-content: space-between;
      position: fixed;
      left: 0;
      bottom: 0;
      border-top: 2px solid $black;
      background: white;
      * {
        color: black;
      }
      h5 {
        font-weight: normal;
        margin-top:0px;
        margin-bottom:24px;
      }
      #mc_embed_signup_scroll {
        background-color: white;
        input, #mc_embed_container {
          display: inline-block;
          font-size: 12px;
          color: $black;
          border:none;
          border-radius: 0;
          background-color: white;
          height: 36px;
          line-height:36px;
          padding:0px;

        }
        > input {
          padding-left:14px;
          width: calc(100% - 110px);
          &:focus {
            outline: none; 
            text-decoration: underline;
          }
        }
        #mc_embed_container {
          float:right;
          input {
            padding:0 14px;
            text-transform: uppercase;
            &:hover {
              font-weight: bold;
            }
            &:focus {
              outline: none;
              font-weight: bold;
            }
          }
        }
      }
    }
    .newsletter {
      color: $black;
      border: 2px solid $black;
      padding: 24px;
      margin-top: 24px;
      cursor: pointer;
      max-width: 395px;
      &-body {
        width: 1280px;
        padding: 32px 42px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        h4 {    
            font-size: 1.3em;
            margin-bottom: 0;
            margin-top: 1.4em;
        }
      }
      &-signup {
        background: $black;
        padding: 24px 36px 36px 36px;
        h5 {
          color: white;
        }
      }
      &-close {
        z-index: 99;
        position: fixed;
        right: 40px;
        bottom: 142px;
      }
      &-spacer {
        height: 132px;
      }
    }
  }

@media only screen and (max-width : $tablet-max-width) {
  #footer {
    margin-bottom: 72px;
    .banner {
      margin-top:0px;
    }
    .newsletter {
      margin-top: 24px;
    }
  }
  .newsletter-close {
    left: calc(100% - 40px) !important;
  }

}
@media only screen and (max-width : $mobile-max-width) {
  .newsletter-body {
    flex-direction: column;
    padding: 22px !important;
    h4 {
      margin-top: 0.5em !important;
    }
  }
  .newsletter-close {
    bottom: 233px !important;
    left: initial !important;
  }
  #footer .mailchimp #mc_embed_signup_scroll > input {
    width: calc(100% - 65px);
  }
  input#mc-embedded-subscribe  {
    padding: 0 9px;
  }
  .modal-enter, .modal-leave-to {
    opacity: 0.3;
    transform: translateY(400px);
  }
}
</style>

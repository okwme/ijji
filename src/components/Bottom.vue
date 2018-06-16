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
      <div class='col-1-12 tab-0'>&nbsp;</div>
      <div class='mailchimp col-5-12 tab-1-2 mob-1-1' v-html='mailchimp && mailchimp.descriptionHtml'></div>
    </div>
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
        return collection.title === 'Mailchimp'
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

<style lang="scss">
  @import "../sass/vars";
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
    .newsletter {
      background-color: $black;
      padding:24px;
      padding-bottom:36px;
      * {
        color: white;
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
  }

@media only screen and (max-width : $tablet-max-width) {
  #footer {
    margin-bottom: 72px;
    .banner {
      margin-top:0px;
    }
    .newsletter {
      margin-top: 48px;
    }
  }
}
</style>

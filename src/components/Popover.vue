<template>
  <div id='popover'>
      <div class='mailchimp' v-html='mailchimp && mailchimp.descriptionHtml'></div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'Popover',

  data () {
    return {

    }
  },
  computed: {
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

<template>
    <q-page padding class="justify-center">
        <div class="border-1" style="border-radius: 15px;">
            <div class="text-center q-my-xl">
                <div>
                  <img src="statics/images/checked.png" style="width: 90px;"/>
                </div>
                <h3 class="q-my-none">Payment Successful!</h3>
                <div class="text-center q-my-lg" v-if="productInfo">
                  <h6 v-if="productInfo.productId !== '1'">{{productInfo.name}}</h6>
                  <div v-html="productInfo.description" style="overflow-x: hidden;"></div>
                  <p class="q-my-lg q-py-lg"></p>
                </div>
                <div v-else class="text-center">
                  <ComponentPreLoader></ComponentPreLoader>
                </div>
            </div>

            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="$router.go(-1)">
              <div class="q-pa-md q-pb-lg">
                <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                  <span >{{$t('done')}}</span>
                </div>
              </div>
            </div>
        </div>
    </q-page>
</template>
<script>
import languageOptions from 'assets/languages.json'
export default {
  data () {
    return {
      productInfo: null
    }
  },
  created () {
    this.getProductInfo()

    if (this.$route.query.success === '1') {
      this.sendImpression('Payment Success', 'Payment Page', `Products (${this.$route.params.productId})`)
    } else if (this.$route.query.success === '0') {
      this.sendImpression('Payment Failed', 'Payment Page', `Products (${this.$route.params.productId})`)
    }
  },
  beforeDestroy () {
    if (this.$q.localStorage.has('campaignCountryId')) {
      //  this.$q.localStorage.remove('campaignCountryId')
    }
  },
  methods: {
    getProductInfo () {
      let languageId = this.$_.findWhere(languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id
      this.$axios.get(`products/${this.$route.params.productId}?language_id=${languageId}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.productInfo = response.data.productInfo
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>
<style lang="stylus">
#content
  max-width: 500px !important
  width: 100% !important

#font
  font-size: 75px !important

h3
  margin-top: 5px !important
</style>

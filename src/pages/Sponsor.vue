<template>
    <q-page class="bg-white">
        <div v-if="productInfo">
            <div v-html="htmlContent" style="overflow-x: hidden;"></div>
            <p class="q-my-lg q-py-lg"></p>

            <!-- Bottom Button -->
            <div class="row text-center fixed-bottom lt-lg" v-if="!$q.platform.is.desktop">
                <div class="col-xs-12" @click="$router.push({name: 'ProductCheckout', params: {productId: productInfo.items[0].id}})">
                    <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-normal" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" :class="{'q-pb-lg': $q.platform.is.cordova}">
                        <span v-if="!showLoading">
                            <strong>{{$t('join.petbacker.sponsor', {programName: productInfo.items[0].name})}}</strong><br/>
                            {{computePricing(productInfo.items[0].countryId, productInfo.items[0].price)}}
                        </span>
                        <span v-else><q-spinner></q-spinner></span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="col-xs-12 text-center">
            <ComponentPreLoader></ComponentPreLoader>
        </div>
    </q-page>
</template>
<script>
import countries from 'assets/countries.json'
import languageOptions from 'assets/languages.json'

export default {
  data () {
    return {
      productInfo: null,
      htmlContent: null,
      showLoading: false
    }
  },
  created () {
    this.getSponsorInfo()
  },
  methods: {
    getSponsorInfo () {
      let languageId = this.$_.findWhere(languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id
      this.$axios.get(`products/rapidpro?language_id=${languageId}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if ((response.status === 204) || (response.data.rapidproInfo.items.length === 0) || (response.data.rapidproInfo.items[0].id === null)) {
          this.$router.go(-1)
          this.$q.notify({message: 'Ooops seem like something wrong with loading the content, please try again later!', type: 'negative', position: 'top'})
        }

        this.productInfo = response.data.rapidproInfo
        this.htmlContent = response.data.rapidproInfo.items[0].description
      }).catch(error => {
        if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
          this.$router.go(-1)

          if (error.response && error.response.data) {
            this.$q.notify({message: error.response.data.message, type: 'negative', position: 'top'})
          } else {
            this.$q.notify({message: 'Ooops seem like something wrong with loading the content, please try again later!', type: 'negative', position: 'top'})
          }
        }
        console.log(error)
      })
    },
    computePricing (currencyId, pricing) {
      let currency = ''
      if (currencyId) {
        currency = this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
      }

      return `${currency} ${pricing}`
    }
  }
}
</script>

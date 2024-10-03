<template>
  <q-page padding class="row justify-center">
    <div class="border-1 col-md-6 col-xs-12" style="border-radius: 15px;" v-if="productInfo">
      <!-- Product Info -->
      <div class="text-center q-mb-lg q-mt-md">
        <img :src="productInfo.imageLink" v-if="productInfo.imageLink" class="image-upload"/>
        <h4 style="color: #55466E;" class="q-my-sm"><strong>{{productInfo.name}}</strong></h4>
        <h5>{{productInfo.offerCurrencyText}} {{productInfo.offerAmount}}</h5>
        <q-separator class="q-my-lg"></q-separator>
      </div>

      <!-- Terms and Conditon -->
      <div class="row">
        <div class="col-xs-12 text-center">
          <q-checkbox v-model="checked" :label="$t('i.agree.term.condition')" />
        </div>
      </div>

      <!-- Payment buttons -->
      <payment-buttons v-if="productInfo" :responseInfo="productInfo" :priceInfo="priceInfo" :currency="currency" :termsChecked="checked" @on-top-up="onTopUp" class="q-mx-md"></payment-buttons>
    </div>
    <div v-else class="text-center">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>

<script>
import languageOptions from 'assets/languages.json'

export default {
  components: {
    'payment-buttons': () => import('components/Checkout/PaymentButtons.vue')
  },
  data () {
    return {
      productInfo: null,
      priceInfo: {},
      checked: false,
      currency: null
    }
  },
  created () {
    this.getProductInfo()

    // set campaign country id
    if (this.$route.query.country) {
      this.countryId = this.$route.query.country
    }

    // check if campaign country id exist
    if (this.$q.localStorage.has('campaignCountryId')) {
      this.countryId = this.$q.localStorage.getItem('campaignCountryId')
    }

    if (this.$route.query.success === '1') {
      let currentUrl = this.$route.path.split('/')
      currentUrl.pop()
      let chatUrl = currentUrl.join('/')

      this.$router.replace(chatUrl)
    }
  },
  mounted () {
    this.sendImpression('Enter', 'Payment Page', `Products (${this.$route.params.productId})`)
  },
  filters: {
    currency: function (value) {
      if (value) {
        return Number.parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      } else {
        return value
      }
    }
  },
  methods: {
    onTopUp () {
      console.log('on top up')
    },
    getProductInfo () {
      let languageId = this.$_.findWhere(languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id
      this.$axios.get(`products/${this.$route.params.productId}?language_id=${languageId}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.productInfo = response.data.productInfo
        this.currency = response.data.productInfo.offerCurrency
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    }
  }
}
</script>

<style lang="stylus">
.online-transfer-title
  margin-left: 14%
</style>

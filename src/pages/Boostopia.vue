<template>
  <q-page padding class="row justify-center">
    <div v-if="preloaded" style="max-width: 1030px;">
        <a :href="$t('petbacker.app.link')" target="_blank">
          <div class="col-md-12 col-xs-2 text-center" @click="sendImpression('Button Click', 'Boostopia Page', 'Download app')">
              <img :src="headerImg" class="image-layout"/>
          </div>
        </a>
        <div class="col-md-6 col-xs-6 q-mb-md q-mt-sm">
            <div class="row justify-center">
                <div class="col-xs-7 col-md-6">
                    <q-btn style="background-color:#f22e16;" @click.native="onBoost()" class="full-width" :loading="boostPaymentButtonLoading" >
                        <img src="statics/images/boost_button.png" style="height: 60px;"/>
                    </q-btn>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-xs-12 text-center" >
            <a :href="$t('link.href.petbacker') + '/reviews-testimonial'" target="_blank"><img :src="bodyImg" class="image-layout" /></a>
            <a :href="$t('link.href.petbacker') + '/d'" target="_blank"><img :src="footerImg" class="image-layout"/></a>
        </div>
    </div>
    <div v-else><ComponentPreLoader></ComponentPreLoader></div>
  </q-page>
</template>

<script>
import countries from 'assets/countries.json'

export default {
  data () {
    return {
      currency: 'MYR',
      bankTransferButtonLoading: false,
      paypalPaymentButtonLoading: false,
      boostPaymentButtonLoading: false,
      boostShow: true,
      promocode: '',
      promocodeModal: false,
      promocodeItems: [],
      priceInfo2: this.priceInfo,
      handle400msgmodal: false,
      msg400: '',
      mobileView: this.$q.platform.is.mobile,
      preloaded: false,
      headerImg: null,
      footerImg: null,
      bodyImg: null
    }
  },
  created () {
    this.checkWidth()
  },
  mounted () {
    this.preloaded = true
  },
  methods: {
    checkWidth () {
      if (this.$q.platform.is.desktop) {
        this.headerImg = 'statics/images/boostopia/boostopia_header_desktop.png'
        this.footerImg = 'statics/images/boostopia/boostopia_footer_desktop.png'
        this.bodyImg = 'statics/images/boostopia/boostopia_body_desktop.png'
      } else {
        this.headerImg = 'statics/images/boostopia/boostopia_header.png'
        this.footerImg = 'statics/images/boostopia/boostopia_footer.png'
        this.bodyImg = 'statics/images/boostopia/boostopia_body.png'
      }
    },
    onPaypal () {
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
        this.$router.replace({name: 'Signup'})
        return
      }

      this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=MYR&price=200&item=hire&payment_method_id=2&is_web=1`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.openUrl(response.data.expressCheckoutInfo.paymentUrl)
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    onBoost () {
      this.sendImpression('Start Purchase', '8 - Boost', 'Product Purchase')
      if (!this.$store.state.user.access) {
        let COOKIE_EXPIRATION = 1
        this.$q.cookies.set('globalStorageReviewInfoUrl', this.$route.fullPath, { expires: COOKIE_EXPIRATION })
        this.$router.replace({name: 'Signup'})
        return
      }

      this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading
      var boostTotalPrice = '40'
      let boostSprintf = 'payments/boost/initiate?currency=%s&amount=%s&remark=%s&payment_method_id=6&redirectURL=%s&productid=12'
      let boostUrl = boostSprintf.sprintf(
        this.currency,
        boostTotalPrice,
        encodeURI('Boostopia Woman\'s Day RM40 Voucher'),
        `${window.location.origin}/boostopia/paymentsuccess`
      )

      this.$axios.get(boostUrl, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.cookies.set('boostPaymentId', response.data.paymentId)
        window.location.href = response.data.checkoutURI
      }).catch(error => {
        this.sendImpression('Failed Purchase', '8 - Boost', 'Product Purchase')
        console.log(error)
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    getCurrencyNameFromCountryID (countryid) {
      for (let i = 0; i < countries.length; i++) {
        if (parseInt(countries[i].id) === countryid) {
          return countries[i].currencyCode
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.image-layout
  width: 100%
</style>

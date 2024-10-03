<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-show="slide-up" transition-hide="slide-down">
        <q-card>
            <q-toolbar style="border-bottom: 1px solid lightgrey;">
                <q-toolbar-title class="text-center">
                    <h6 class="q-my-none font-normal" style="margin-left: 22%">Promotional Package</h6>
                </q-toolbar-title>
                <q-btn flat icon="close" style="color: black;" :ripple="false" @click="onClose"></q-btn>
            </q-toolbar>

            <q-card-section class="border-1 col-md-6 col-xs-12" style="border-radius: 15px;" v-if="productInfo">
                <!-- Product Info -->
                <div class="text-center q-mb-lg q-mt-md" v-if="productInfo">
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
                <div class="row" :class="$q.platform.is.desktop ? 'q-px-xs': 'q-px-lg'">
                    <div class="col-xs-12 q-pt-md" :class="$q.platform.is.desktop ? 'q-px-lg': ''">
                    <q-btn size="lg" color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onQRPayment('paynow')" v-if="payNowShow" :disabled="!checked || weChatButtonLoading" :loading="payNowButtonLoading" class="full-width q-my-xs" :label="$t('paynow.payment')"></q-btn>
                    <q-btn size="lg" color="green" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onQRPayment('wechat')"  v-if="weChatShow" :disabled="!checked || weChatButtonLoading" :loading="weChatButtonLoading" class="full-width q-my-xs" :label="$t('wechat.payment')"></q-btn>
                    <q-btn size="lg" color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onQRPayment('bharat')" v-if="bharatPeShow" :disabled="!checked || bharatPeButtonLoading" :loading="bharatPeButtonLoading" class="full-width q-my-xs" :label="$t('bharatpe.payment')"></q-btn>
                    <q-btn size="lg" style="background-color:#F22E16;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onBoost" v-if="boostShow" :disabled="!checked || boostPaymentButtonLoading" :loading="boostPaymentButtonLoading" class="full-width text-white q-my-xs" :label="$t('boost')"></q-btn>
                    <q-btn size="lg" style="background-color:#41924B;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="oniPay(523); grabpayPaymentButtonLoading = true" v-if="boostShow" :disabled="!checked || grabpayPaymentButtonLoading" :loading="grabpayPaymentButtonLoading" class="full-width text-white q-my-xs" label="GrabPay"></q-btn>
                    <q-btn size="lg" style="background-color:#20286d;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="oniPay(538); touchngoPaymentButtonLoading = true" v-if="boostShow" :disabled="!checked || touchngoPaymentButtonLoading" :loading="touchngoPaymentButtonLoading" class="full-width text-white q-my-xs" label="Touch n Go Wallet (QR Code)"></q-btn>
                    <q-btn size="lg" color="primary" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onQRPayment('bank-transfer')" v-if="bankTransferShow" :disabled="!checked || bankTransferButtonLoading" :loading="bankTransferButtonLoading" class="full-width q-my-xs" :label="$t('checkout.bank.transfer')"></q-btn>
                    <q-btn size="lg" style="background-color:#F47746;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="showOnlineTransferOptions" v-if="iPayOnlineTransferShow" :disabled="!checked || iPayOnlineTransferLoading" :loading="iPayOnlineTransferLoading" class="full-width q-my-xs text-white" label="Online Transfer"></q-btn>
                    <q-btn size="lg" style="background-color:#1A3386;" :title="!checked ? 'Please Accept Terms and Condtions' : ''" @click.native="onCreditCard()" v-if="showCreditCard" :disabled="!checked || paypalPaymentButtonLoading" :loading="paypalPaymentButtonLoading" class="full-width q-mt-xs text-white" :label="$t('credit.debit.card')"></q-btn>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 text-center q-pt-sm">
                    <img src="statics/images/donate-now-payment.png" alt="PayPal Logo" style="height: 45px;">
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-else class="text-center">
                <ComponentPreLoader></ComponentPreLoader>
            </q-card-section>
        </q-card>

        <!-- Online Transfer Dialog -->
        <q-dialog v-model="modalOnlineTransferOptions" v-if="onlineTransferOption" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''">
            <q-card style="width: 430px;min-height: 400px;">
                <q-toolbar class="q-pl-xs">
                <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none" :class="{'online-transfer-title' : $q.platform.is.mobile}">Online Bank Transfer</h6>
                </q-toolbar-title>
                </q-toolbar>

                <q-card-section style="min-height: 150px;">
                <div v-for="(bankOption, index) in onlineTransferOption.items" :key="index">
                    <q-item @click.native="oniPay(bankOption.payment_option)" class="q-px-none">
                    <q-item-section avatar >
                        <img :src="bankOption.image" class="image-upload" style="max-width: 115px;"/>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{bankOption.payment_name}}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="chevron_right"></q-icon>
                    </q-item-section>
                    </q-item>

                    <q-separator class="q-my-sm"></q-separator>
                </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-dialog>
</template>

<script>
import moment from 'moment'
import languageOptions from 'assets/languages.json'

export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    productId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      productInfo: null,
      checked: false,
      currency: null,
      bankTransferButtonLoading: false,
      paypalPaymentButtonLoading: false,
      boostPaymentButtonLoading: false,
      iPayAvailableOn: ['MYR'],
      iPayOnlineTransferAvailableOn: ['MYR'],
      iPayOnlineTransferShow: false,
      iPayOnlineTransferLoading: false,
      onlineTransferOption: null,
      modalOnlineTransferOptions: false,
      bankTransferAvailOn: ['TWD'],
      bankTransferShow: false,
      boostAvailableOn: ['MYR'],
      weChatAvailableOn: ['HKD', 'CNY'],
      bharatPeAvailableOn: ['INR'],
      payNowAvailableOn: ['SGD'],
      boostShow: false,
      weChatShow: false,
      bharatPeShow: false,
      payNowShow: false,
      promocode: '',
      promocodeModal: false,
      promocodeItems: [],
      handle400msgmodal: false,
      msg400: '',
      mobileView: this.$q.platform.is.mobile,
      weChatButtonLoading: false,
      bharatPeButtonLoading: false,
      payNowButtonLoading: false,
      grabpayPaymentButtonLoading: false,
      touchngoPaymentButtonLoading: false,
      addPromocodeModal: false,
      manualPromocode: '',
      countryId: this.$store.getters['user/getUserPrefferedCurrency'],
      iPayCreditCard: true,
      showCreditCard: true
    }
  },
  created () {
    if (this.$route.query.success === '1') {
      this.sendImpression('Payment Success - iPay', 'Payment Page', `Products (${this.productId})`)
      this.$router.replace({name: 'ProductPaymentSuccess', query: {success: 1, redirectUrl: this.$route.fullPath}})
    } else if (this.$route.query.success === '0') {
      this.sendImpression('Payment Failed - iPay', 'Payment Page', `Products (${this.productId})`)
    }

    window.addEventListener('Payment-Status', this.onPaymentDone)
    window.addEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  beforeDestroy () {
    window.removeEventListener('Payment-Status', this.onPaymentDone)
    window.removeEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  filters: {
    currency: function (value) {
      if (value) {
        return Number.parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      } else {
        return value
      }
    },
    readableDate: function (value) {
      return moment(value).format('DD MMM YYYY')
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.getProductInfo()
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    },
    onInAppBrowserClosed () {
      this.boostPaymentButtonLoading = false
      this.paypalPaymentButtonLoading = false
      this.grabpayPaymentButtonLoading = false
      this.touchngoPaymentButtonLoading = false
    },
    onPaymentDone (info) {
      if (info.detail.status === '1') {
        this.sendImpression('Payment Success', 'Payment Page', `Products (${this.productId})`)
        this.$router.replace({name: 'ProductPaymentSuccess', query: {success: 1, redirectUrl: this.$route.fullPath}})
      } else if (info.detail.status === '0') {
        this.sendImpression('Payment Failed', 'Payment Page', `Products (${this.productId})`)
        // this.$q.dialog({
        //   title: this.$t('sorry'),
        //   message: this.$t('requests.error.title'),
        //   ok: this.$t('navbar.talk.support'),
        //   cancel: this.$t('ok'),
        //   noBackdropDismiss: true,
        //   noEscDismiss: true
        // }).onOk(() => {
        //   this.$router.replace({name: 'ChatSupportHelp'})
        // })
      }
    },
    onCreditCard () {
      this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading

      if (this.iPayAvailableOn.includes(this.productInfo.offerCurrencyText) && this.iPayCreditCard) {
        this.oniPay()
        this.sendImpression('Button Clicked', 'iPay Credit Card', `Products (${this.productId})`)
      } else {
        this.onPaypal()
        this.sendImpression('Button Clicked', 'PayPal', `Products (${this.productId})`)
      }
    },
    showOnlineTransferOptions () {
      this.modalOnlineTransferOptions = true
    },
    getProductInfo () {
      let languageId = this.$_.findWhere(languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id
      this.$axios.get(`products/${this.productId}?language_id=${languageId}&country_id=${this.countryId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.productInfo = response.data.productInfo
        if (this.bankTransferAvailOn.includes(this.productInfo.offerCurrencyText)) {
          this.bankTransferShow = true
        } else {
          this.bankTransferShow = false
        }

        if (this.boostAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.boostShow = true
        } else {
          this.boostShow = false
        }

        if (this.weChatAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.weChatShow = true
        } else {
          this.weChatShow = false
        }

        if (this.bharatPeAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.bharatPeShow = true
        } else {
          this.bharatPeShow = false
        }

        if (this.payNowAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.payNowShow = true
        } else {
          this.payNowShow = false
        }

        if (this.iPayAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.iPayOnlineTransferShow = true
          this.getOnlineTransferOptions()
        } else {
          this.iPayOnlineTransferShow = false
        }

        if (this.iPayAvailableOn.includes(this.productInfo.offerCurrencyText) && Boolean(this.productInfo.ipayCCStatus)) {
          this.showCreditCard = true
        } else if (this.iPayAvailableOn.includes(this.productInfo.offerCurrencyText)) {
          this.showCreditCard = false
        }

        this.iPayCreditCard = Boolean(this.productInfo.ipayCCStatus)
        this.currency = this.productInfo.offerCurrencyText
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    },
    getOnlineTransferOptions () {
      this.$axios.get(`payments/ipay/paymentoption/${this.$store.getters['user/getUserMobileCountryId']}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.onlineTransferOption = response.data.ipayPaymentOptions
      }).catch(e => {
        console.error(e)
      })
    },
    onQRPayment (type) {
      // compute total price with credit card charge
      let totalPrice = this.productInfo.offerAmount

      // insert into local storage to be retrieved on QR page
      let petSitterDetail = {}
      petSitterDetail.userServiceName = this.productInfo.name
      petSitterDetail.jobReference = `${this.productInfo.name} (${this.productInfo.productId})`
      petSitterDetail.amountInCurrencyText = this.productInfo.offerCurrencyText + ' ' + Number.parseFloat(totalPrice).toFixed(2)
      petSitterDetail.currencyText = this.productInfo.offerCurrencyText
      petSitterDetail.id = this.productInfo.productId
      petSitterDetail.requestId = null
      petSitterDetail.acceptanceStatus = null
      this.$q.localStorage.set('petSitterDetails', petSitterDetail)

      // to payment page
      switch (type) {
        case 'paynow': this.$router.replace({name: 'PayNow'}); break
        case 'wechat': this.$router.replace({name: 'WeChat'}); break
        case 'bharat': this.$router.replace({name: 'BharatPe'}); break
        case 'bank-transfer': this.$router.replace('/bank-transfer'); this.sendImpression('Button Clicked', 'Bank Transfer', `Products (${this.productId})`); break
      }
    },
    onBoost () {
      this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading

      let boostSprintf = 'payments/boost/initiate?currency=%s&amount=%s&remark=%s&rsl_id=%s&payment_method_id=6&redirectURL=%s'
      let boostUrl = boostSprintf.sprintf(
        this.currency,
        this.productInfo.offerAmount,
        encodeURI(this.productInfo.name),
        this.productInfo.productId,
        `${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}/expresscheckout/boost`
      )

      this.$axios.get(boostUrl, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.cookies.set('boostPaymentId', response.data.paymentId)
        this.openUrl(response.data.checkoutURI)
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.boostPaymentButtonLoading = !this.boostPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    oniPay (paymentId = 2) {
      if (paymentId !== 2) {
        this.sendImpression('Button Clicked', `iPay Online Transfer (${paymentId})`, `Products (${this.productId})`)
      }

      this.$axios.get(`/payments/ipay/initiate?product_id=${this.productId}&device=5&payment_option=${paymentId}&deep_link=${encodeURI(`${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${this.$route.fullPath}`)}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.openUrl(this.$t('link.href.petbacker') + response.data.paymentURL)
        setTimeout(() => {
          this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        }, 2500)
      }).catch(error => {
        this.sendImpression('Transaction Failed', 'iPay', `Products (${this.productId})`)
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    onPaypal (productInfo = null) {
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=MYR&price=${this.productInfo.offerAmount}&item=${this.productInfo.name}&payment_method_id=2&is_web=1&product_id=${this.productInfo.productId}&redirect_success_url=${encodeURI(`${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${`/product/${this.productId}/success-payment`}`)}&redirect_cancelled_url=${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${this.$route.fullPath}?success=0`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.openUrl(response.data.expressCheckoutInfo.paymentUrl)
        setTimeout(() => {
          this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        }, 4500)
      }).catch(error => {
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.paypalPaymentButtonLoading = !this.paypalPaymentButtonLoading
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    }
  }
}
</script>

<style lang="stylus">
.online-transfer-title
  margin-left: 14%
</style>

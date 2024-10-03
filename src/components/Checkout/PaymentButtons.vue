<template>
  <div>
    <div class="col-xs-12 q-pt-md" :class="$q.platform.is.desktop ? 'q-px-lg': ''">
      <payment-button v-for="option in paymentOptions" :key="option.id"
      :termsChecked="termsChecked"
      :paymentName="option.paymentName"
      :gatewayHref="option.href"
      :paymentLink="option.paymentLink || ''"
      :color="option.btnColor || '#9B89B9'"
      :type="option.type"
      :warningMsgTitle="option.warningMessageDetail ? option.warningMessageDetail.title || '' : ''"
  :warningMsgDescription="option.warningMessageDetail ? option.warningMessageDetail.details || '' : ''"
      :warningShow = "option.warningMessage"
      @on-prompt="triggerServerError"
      @top-up-info="topUpPromptInfo"></payment-button>
    </div>
    <!-- Error Dialog -->
    <dialog-error :trigger="handle400msgmodal" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="errorOkLabel" @on-ok="onErrorOk" @on-close="triggerServerError"></dialog-error>
  </div>
</template>
<script>
export default {
  components: {
    'payment-button': () => import('components/Checkout/GatewayButton.vue'),
    'dialog-error': () => import('components/DialogError.vue')
  },
  props: {
    responseInfo: {
      type: Object,
      required: true,
      default: () => { return null }
    },
    currency: {
      required: true
    },
    termsChecked: {
      type: Boolean,
      required: true
    },
    hidePayWithWallet: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      handle400msgmodal: false,
      errorStatus: 0,
      errorMessage: null,
      errorOkLabel: null,
      topUpAmount: null,
      topUpInfo: null,
      paymentOptions: null
    }
  },
  created () {
    if (this.$route.query.success === '1') {
      let currentUrl = this.$route.path.split('/')
      currentUrl.pop()
      let chatUrl = currentUrl.join('/')

      this.$router.replace(chatUrl)
      return
    }

    // get payment options available
    this.getPaymentOptions()
  },
  mounted () {
    window.addEventListener('Payment-Status', this.onPaymentDone)
    window.addEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  beforeDestroy () {
    window.removeEventListener('Payment-Status', this.onPaymentDone)
    window.removeEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  methods: {

    checkwarn () {
      if (this.paymentOptions.warningMessage === 1) {
        this.checkwarning = true
      }
    },
    onInAppBrowserClosed () {
      console.log('on closed')
    },
    onPaymentDone (info) {
      if (localStorage.getItem('promocode') !== null) {
        localStorage.removeItem('promocode')
      }
      if (info.detail.status === '1' && this.$route.name === 'Checkout') {
      /**
       * On success from payment gateway,
       * redirect back chat
       */
        let currentUrl = this.$route.path.split('/')
        currentUrl.pop()
        let chatUrl = currentUrl.join('/')
        this.$router.replace(chatUrl)
      } else if (info.detail.status === '1' && this.$route.name === 'ProductCheckout') {
      /**
       * On success from payment gateway,
       * redirect product payment succcess page
       */
        this.$q.notify({message: `${this.$t('payments')} ${this.$t('successful')}`, position: 'top', type: 'positive'})
        this.$router.replace({name: 'ProductPaymentSuccess', params: {productId: this.$route.params.productId}, query: {success: 1}})
      } else if (info.detail.status === '0') {
      /**
       * On failure from payment gateway,
       * prompt user contact support for help
       */
        this.$q.dialog({
          title: this.$t('sorry'),
          message: this.$t('requests.error.title'),
          ok: this.$t('navbar.talk.support'),
          cancel: this.$t('ok'),
          noBackdropDismiss: true,
          noEscDismiss: true
        }).onOk(() => {
          this.$router.push({name: 'HelpCenter'})
        })
      }
    },
    triggerServerError (status, errorStatus = 0, errorMessage = null, errorOkLabel = null) {
      if (errorStatus) {
        this.errorStatus = errorStatus
      }

      if (errorMessage) {
        this.errorMessage = errorMessage
      }

      if (errorOkLabel) {
        this.errorOkLabel = errorOkLabel
      }

      this.handle400msgmodal = status
    },
    onErrorOk (codeStatus) {
      if (codeStatus === 13) {
      // insufficinet balance in wallet
      // redirect to show top up methods
        this.$emit('on-top-up', this.topUpAmount, this.topUpInfo)
      }
    },
    topUpPromptInfo (depositAmount = null, itemsPrice = null) {
      this.topUpAmount = depositAmount

      if (depositAmount && itemsPrice) {
        this.topUpInfo = {
          'itemsPrice': itemsPrice,
          'totalPrice': depositAmount
        }
      }
    },
    getPaymentOptions () {
      let paymentLink = 'jobId='
      if (this.$route.name === 'Checkout') {
        paymentLink += `${this.$route.params.response}`
      } else if (this.$route.name === 'ProductCheckout') {
        paymentLink = `productId=${this.$route.params.productId}`
      }

      this.$axios.get(`payments?${paymentLink}&country=${this.currency}&topup=${this.hidePayWithWallet ? '1' : '0'}&isWeb=${this.$q.platform.is.cordova ? '0' : '1'}&deepLink=${encodeURI(`${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${this.$route.fullPath}`)}&deepLinkSuccess=${encodeURI(`${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${this.$route.fullPath}?success=1`)}&deepLinkFailed=${encodeURI(`${this.$q.platform.is.cordova ? 'petbacker:/' : `https://${window.location.host}`}${this.$route.fullPath}?success=0`)}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.paymentOptions = response.data.paymentOptions.items
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.triggerServerError(true, e.response.data.code, e.response.data.message, e.response.data.okBtnLabel)
        }
      })
    }
  }
}
</script>

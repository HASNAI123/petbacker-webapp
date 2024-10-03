<template>
  <div>
      <q-btn size="lg" class="full-width q-mt-xs text-white" :style="`background-color:${color};`"
      :title="!termsChecked ? 'Please Accept Terms and Condtions' : ''"
      :disabled="paymentButtonLoading"
      :label="paymentName"
      @click="onPaymentSelection"></q-btn>
      <div class="col-xs-12 text-center q-pt-sm" v-if="paymentName.toLowerCase().includes('card')">
          <img src="statics/images/donate-now-payment.png" alt="PayPal Logo" height="45px" />
      </div>
     <!--  {{paymentName}} {{ warningShow}} {{warningMsgDescription}} {{warningMsgTitle}} -->
      <!-- Dialog Bank Transfer -->
      <dialog-bank-payment v-if="type === 4" :trigger="bankPaymentModal" :href="paymentLink" @on-close="onTriggerBankPayment"></dialog-bank-payment>

      <!-- Dialog QR Payment -->
      <dialog-qr-payment v-else-if="type === 5" :trigger="qrPaymentModal" :href="paymentLink" @on-close="onTriggerQRPayment"></dialog-qr-payment>

      <!-- Dialog Ipay Online Transfer -->
      <dialog-ipay-online-transfer v-else-if="type === 2" :trigger="subOptionsModal" :href="gatewayHref" @on-close="onTriggerSubOptionsModal"></dialog-ipay-online-transfer>

       <!-- Warnging Dialog -->
       <Dialog-Msg
      :trigger ="showwarningmodal"
      @on-close=" closeWarningDialog"
      @on-ok = "override"
      :title = "warningMsgTitle"
      :message = "warningMsgDescription"
>

    </Dialog-Msg>
  </div>
</template>
<script>

export default {
  components: {
    'dialog-bank-payment': () => import('components/Checkout/DialogBankTransfer.vue'),
    'dialog-qr-payment': () => import('components/Checkout/DialogQRPayment.vue'),
    'dialog-ipay-online-transfer': () => import('components/Checkout/DialogIpayOnlineTransfer.vue'),
    'Dialog-Msg': () => import('components/DialogPaymentMsg.vue')
  },
  props: {
    termsChecked: {
      type: Boolean,
      require: true,
      default: false
    },
    paymentName: {
      type: String,
      require: true
    },
    gatewayHref: {
      type: String,
      require: true
    },
    paymentLink: {
      type: String
    },
    type: {
      type: Number,
      require: true
    },
    color: {
      type: String,
      require: true
    },
    warningMsgTitle: {
      type: String,
      require: true

    },
    warningMsgDescription: {
      type: String,
      require: true

    },
    warningShow: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      paymentButtonLoading: false,
      subOptionsModal: false,
      bankPaymentModal: false,
      qrPaymentModal: false,
      showError: false,
      showwarningmodal: false,
      overridepay: 0
    }
  },
  mounted () {
    // Add event listeners when the component is mounted
    window.addEventListener('blur', this.handleWindowBlur)
    window.addEventListener('focus', this.handleWindowFocus)
  },
  beforeDestroy () {
    // Remove event listeners when the component is destroyed
    window.removeEventListener('blur', this.handleWindowBlur)
    window.removeEventListener('focus', this.handleWindowFocus)
  },
  methods: {
    override () {
      this.overridepay = 1
      this.onPaymentSelection()
    },

    closeWarningDialog (status) {
      this.showwarningmodal = status
    },
    onPaymentSelection () {
      if (!this.termsChecked) {
        this.$emit('on-prompt', true, 0, 'Please Accept Terms and Condtions', this.$t('ok'))
        return
      }

      if (this.warningShow === 1 && this.overridepay === 0) {
        console.log('checking warning number paymney', this.warningShow)
        this.showwarningmodal = true
        return
      }
      this.sendImpression('Payment Button clicked', 'Credit Card button Clicked', 'Checkout')
      switch (this.type) {
      /**
         * Payment Type 1, do a GET request on payment link
         * --------------------------------------
         * TYPE 1 - goes into gateway for payment
         */
        case 1:
          this.initiateGateway(this.paymentLink)
          break

        /**
         * Payment Type 2, nested payment options available
         * --------------------------------------
         * Currently use to display IPay FPX options (Online Transfer)
         */
        case 2:
          this.onTriggerSubOptionsModal(true)
          break

        /**
         * Payment Type 3, do a POST request on payment link
         * --------------------------------------
         * Currently use to do "Pay with Wallet" option
         */
        case 3:
          this.initiateWalletPayment(this.paymentLink)
          break

        /**
         * Payment Type 4 and 5, do a GET to get payment Info
         * --------------------------------------
         * TYPE 4 - Bank Info
         * TYPE 5 - QR payment Info
         */
        case 4:
          this.onTriggerBankPayment(true)
          break
        case 5:
          this.onTriggerQRPayment(true)
          break
      }

      this.overridepay = 0
    },
    initiateGateway (gatewayLink) {
      this.paymentButtonLoading = true
      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})

      this.$axios.get(gatewayLink, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.openUrl(response.data.checkoutInfo.paymentUrl)
      }).catch((error) => {
        console.error(error)
        if (error.response && error.response.data) {
          this.$emit('on-prompt', true, error.response.data.code, error.response.data.message, error.response.data.okBtnLabel)
        }
      }).finally(_ => {
        this.paymentButtonLoading = false
        this.$q.loading.hide()
      })
    },
    initiateWalletPayment () {
      this.paymentButtonLoading = true
      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})

      this.$axios.post(this.paymentLink, {}, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (this.$route.name === 'Checkout') {
        /**
         * On success from payment gateway,
         * redirect back chat
         */
          let currentUrl = this.$route.path.split('/')
          currentUrl.pop()
          let chatUrl = currentUrl.join('/')
          this.$router.replace(chatUrl)
        } else if (this.$route.name === 'ProductCheckout') {
        /**
         * On success from payment gateway,
         * redirect product payment succcess page
         */
          this.$q.notify({message: `${this.$t('payments')} ${this.$t('successful')}`, position: 'top', type: 'positive'})
          this.sendImpression('Payment Success')
          this.$router.replace({name: 'ProductPaymentSuccess', params: {productId: this.$route.params.productId}, query: {success: 1}})
        }
      }).catch((e) => {
        console.error(e)
        this.$emit('top-up-info', null, null)
        if (e.response && e.response.data) {
          this.$emit('on-prompt', true, e.response.data.code, e.response.data.message, e.response.data.okBtnLabel)

          if (e.response.data.itemsPrice && e.response.data.itemsPrice.length > 0) {
            this.$emit('top-up-info', e.response.data.depositAmount, e.response.data.itemsPrice)
          } else if (e.response.data.depositAmount) {
            this.$emit('top-up-info', e.response.data.depositAmount, null)
          }
        }
      }).finally(_ => {
        this.paymentButtonLoading = false
        this.$q.loading.hide()
      })
    },
    onTriggerBankPayment (status) {
      this.bankPaymentModal = status
    },
    onTriggerQRPayment (status) {
      this.qrPaymentModal = status
    },
    onTriggerSubOptionsModal (status) {
      this.subOptionsModal = status
    }
  }
}
</script>

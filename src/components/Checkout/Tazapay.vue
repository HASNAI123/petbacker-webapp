
<script type="text/javascript" src="https://js-sandbox.tazapay.com/v1.2-sandbox.js"></script>

<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :transition-hide="$q.platform.is.mobile ? 'slide-right' : ''" :transition-show="$q.platform.is.mobile ? 'slide-left' : ''">
      <q-card style="min-width: 320px;min-height: 400px;">
        <q-toolbar class="bg-white fixed-top" style="border-bottom: solid 1px lightgrey;z-index: 5000;">
          <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
        </q-toolbar>
        <q-card-section>
            <div id="tz-checkout"></div>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script>
import createCheckoutSession from '../../assets/tazapay-create-checkout.js'
export default {
  props: {
    trigger: {
      type: Boolean,
      require: true,
      default: false
    },
    href: {
      type: String,
      require: true
    },
    topup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imageLink: null,
      pictureUploading: false,
      petsitterDetails: null,
      paymentInfo: null,
      modal: false,
      copied: false,
      amount: null,
      txn_desc: null,
      completeUrl: null,
      errorUrl: null,
      callbackUrl: null,
      referenceId: null
    }
  },
  mounted () {
    let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://js-sandbox.tazapay.com/v1.2-sandbox.js')
      document.head.appendChild(recaptchaScript)
    document.addEventListener('deviceready', this.onDeviceReady, false)

  },
  updated() {
    this.getTazapay()
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        this.paymentInfo = this.getPaymentInfo()
      }
    }
  },
  beforeDestroy () {
  },
  methods: {
    async getTazapay() {
      await this.getPaymentInfo()
        var token = await createCheckoutSession(this.href, this.amount, this.txn_desc, this.errorUrl, this.completeUrl, this.callbackUrl, this.referenceId)
        const options = {
                clientToken: token, // Use the token obtained at step2.
                callbacks: {
                    // onPaymentSuccess: () => { this.$router.push(this.completeUrl) },
                    onPaymentSuccess: () => { window.location.href = this.completeUrl },
                    onPaymentFail: () => { window.location.href = this.errorUrl },
                },
                style: {},
                config: {
                    redirectionTarget: "self"
                },
        }

        window.tazapay.checkout(options)
    },
    getPaymentInfo() {
      return new Promise((resolve, reject) => {
        this.$axios.get(this.href, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.amount = response.data.tazaData.invoice_amount;
          this.txn_desc = response.data.tazaData.txn_description;
          this.completeUrl = response.data.tazaData.complete_url;
          this.callbackUrl = response.data.tazaData.callback_url;
          this.errorUrl = response.data.tazaData.error_url;
          this.referenceId = response.data.tazaData.reference_id;
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
    onClose () {
      this.$emit('on-close', false)
      this.modal = false
    }
  }
}
</script>

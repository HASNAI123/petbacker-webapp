<template>
  <q-page padding class="row justify-center">
    <div class="border-1 col-md-6 col-xs-12 q-mb-lg" style="border-radius: 15px;" v-if="responseInfo && requestInfo && priceInfo">
      <!-- Quote Details -->
      <quote-detail :responseInfo="responseInfo" :priceInfo="priceInfo" :requestInfo="requestInfo" @refresh-price="getPriceInfo"></quote-detail>

      <!-- Terms and Conditon -->
      <div class="row">
        <div class="col-xs-12 text-center">
          <q-checkbox v-model="checked" :label="$t('i.agree.term.condition')" />
        </div>
      </div>

      <!-- Payment buttons -->
      <payment-buttons v-if="responseInfo" :responseInfo="responseInfo" :priceInfo="priceInfo" :currency="responseInfo.offerCurrency" :termsChecked="checked" @on-top-up="onTopUp" class="q-mx-md"></payment-buttons>
    </div>
    <div v-else><ComponentPreLoader></ComponentPreLoader></div>

    <!-- Dialog Top Up Wallet -->
    <dialog-topup v-if="responseInfo" :trigger="topUpModal" :topUpAmount="parseInt(topUpAmount)" :topUpInfo="topUpInfo" :responseInfo="responseInfo" :currency="currency" @on-close="triggerTopUpModal"></dialog-topup>
  </q-page>
</template>

<script>
import moment from 'moment'
export default {
  components: {
    'quote-detail': () => import('components/QuoteDetail.vue'),
    'payment-buttons': () => import('components/Checkout/PaymentButtons.vue'),
    'modal-moreinfo': () => import('components/ModalMoreInfo.vue'),
    'dialog-topup': () => import('components/Checkout/DialogTopUp.vue')
  },
  data () {
    return {
      priceInfo: null,
      responseInfo: null,
      requestInfo: null,
      BREED_OF_PET: 5,
      TYPE_OF_PET: 3,
      SIZE_OF_PET: 7,
      NO_OF_PET: 1,
      checked: false,
      currency: null,
      topUpModal: false,
      topUpAmount: null,
      topUpInfo: {}
    }
  },
  created () {
    this.getRequestInfo()
    this.getResponseInfo()
    this.getPriceInfo()
  },
  filters: {
    currency (value) {
      if (value) {
        return Number.parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      } else {
        return value
      }
    },
    readableDate (value) {
      return moment(value).format('DD MMM YYYY')
    }
  },
  methods: {
    onTopUp (topUpAmount, topUpInfo = null) {
      this.topUpAmount = topUpAmount
      this.topUpInfo = topUpInfo
      this.triggerTopUpModal(true)
    },
    triggerTopUpModal (status) {
      this.topUpModal = status
    },
    getResponseInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.responseInfo = response.data.responseInfo
        this.currency = this.responseInfo.offerCurrencyText
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    },
    getPriceInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.response}/checkprice`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.priceInfo = response.data.priceInfo
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    },
    getRequestInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.requestInfo = response.data.requestInfo
      }).catch(e => {
        this.forceLogout(e)
        console.log(e)
      })
    }
  }
}
</script>

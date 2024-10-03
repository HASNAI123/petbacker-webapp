<template>
  <q-page class="row justify-center text-center" padding>
    <q-card class="col-md-5 col-xs-12" :class="$q.platform.is.desktop ? 'q-pa-xl' : 'q-pa-xs'" style="max-width:1030px;">
      <q-card-section>
        <!--
        <div class="q-pb-lg">
          <div class="full-width" v-if="paymentStatus === null"><q-spinner size="80px"/></div>
        </div>
        -->
        <template>
            <h4 class="text-left q-mb-lg q-mt-none" style="color: purple;">Thank you for purchasing the Boostopia Woman's Day RM40 voucher</h4>
            <q-separator inset/>
            <p class="text-left text-18 q-mt-lg">Thank you for the support! You will receive the following vouchers in your account in the next 24 hours:</p>
            <ul class="text-left text-16">
                <li>MYR40 Voucher.</li>
            </ul>
            <a href="/boostopia" target="_self"><p class="text-left text-16">Buy another voucher</p></a>
            <br/>
            <p class="text-left text-18">Voucher Terms and conditions</p>
            <ul class="text-left text-16 q-mt-lg">
              <li>RM8 Cashback wil be issued by Boost in your boost wallet</li>
              <li>3 transactions per boost account</li>
              <li>Promo valid only on March 8th, 2020</li>
              <li>Voucher valid for all services</li>
              <li>Voucher valid for 1 year</li>
            </ul>
            <p class="text-left text-16">Click <a>here</a> to learn how to use these vouchers for your next booking.</p>
            <p class="text-left text-16">Make a request for your next Pet Services booking today!</p>
        </template>
        <div class="row justify-center">
          <q-btn style="font-size: 16px;" :label="$t('button.download.app')" :class="$q.platform.is.desktop ? 'q-mt-xl q-mr-xl' : 'q-mt-sm q-mr-md'" class="col-md-4 col-xs-6 q-py-md" @click.native="openNewTab()" color="primary"></q-btn>
          <q-btn style="font-size: 16px;"  :label="$t('requests.page.makerequest')" :class="$q.platform.is.desktop ? 'q-mt-xl' : 'q-mt-sm'" class="col-md-4 col-xs-5" @click.native="$router.replace('/services')" color="primary"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
/* global bugsnagClient */
export default {
  data () {
    return {
      paymentStatus: null,
      boostPaymentId: this.$q.cookies.get('boostPaymentId') || null,
      countdown: 5
    }
  },
  created () {
    this.checkPayment()
  },
  methods: {
    openNewTab () {
      this.openUrl(this.$t('petbacker.app.link'))
      this.sendImpression('Button Click', 'Boostopia Payment Success Page', 'Download app')
    },
    checkPayment () {
      if (this.boostPaymentId === null) {
        return
      }
      this.$axios.get(`payments/boost/${this.boostPaymentId}/status`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.paymentStatus = response.data.success
        this.$q.cookies.remove('boostPaymentId')
        if (this.paymentStatus) {
          this.sendImpression('Successfully Purchased', '8 - Boost', 'Product Purchase')
        } else {
          this.sendImpression('Successfully Purchased', '8 - Boost', 'Product Purchase')
        }
      }).catch(error => {
        this.sendImpression('Failed Purchase', '8 - Boost', 'Product Purchase')
        console.log(error)
        console.log(this.boostPaymentId)
        bugsnagClient.notify(error)
      })
    }
  },
  beforeDestroy () {
  }
}
</script>

<style lang="stylus">
.text-18
 font-size: 18px

.text-16
 font-size: 16px
</style>

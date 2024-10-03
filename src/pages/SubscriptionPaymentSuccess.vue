<template>
    <q-page class="row justify-center">
        <div class="col-md-6 col-sm-12" >
            <div :class="this.$q.platform.is.mobile ? 'q-pl-md' : ''">
              <h6 class="col-md-12 text-weight-bold q-mb-md">{{$t('thank.you.premium.care')}}</h6>
              <p v-html="$t('thank.you.premium.care.details')"></p>
            </div>
            <div :class="this.$q.platform.is.mobile ? 'q-pl-md' : ''">
              <h6 class="col-md-12 text-weight-bold q-mb-md">{{$t('plan.summary')}}</h6>
            </div>
            <div class="border-1 q-pa-lg">
              <div class="row q-mb-md" >
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('plan.type')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{this.info.productId === '14' ? 'Basic' : 'Plus'}}</p>
              </div>
              <div class="row q-mb-md">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('validity.dates')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{this.info.startDate}} - {{this.info.endDate}} - 1 {{$t('year')}}</p>
              </div>
              <div class="row q-mb-md">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('pet.covered')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">1 {{$t('pet')}}</p>
              </div>
              <div class="row q-mb-md">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('payment.method')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{this.info.paymentMethod}}</p>
              </div>
              <div class="row q-mb-md" v-if="transactionId">
                <p class="text-label col-xs-12 col-md-12 q-mb-xs">{{$t('transaction.id')}}</p>
                <p class="text-label col-xs-12 col-md-12" style="color:black">{{this.transactionId}}</p>
              </div>
              <q-card flat class="text-white q-pa-md q-mb-md" style="background-color:#6E8CA0;border-radius:15px;">
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size:18px;">{{$t('gross.premium')}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-white q-mr-md" style="font-size:18px;">{{this.info.currency}} {{this.info.price}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator color="white" spaced inset/>
                <q-item class="text-weight-bold">
                  <q-item-section>
                    <q-item-label style="font-size:18px;">{{$t('total.payable.amount')}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-white q-mr-md" style="font-size:18px;">{{this.info.currency}} {{this.info.price}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
        </div>
    </q-page>
</template>
<script>

export default {
  data () {
    return {
      loaded: false,
      success: Boolean(this.$route.query.success),
      userCurrency: this.$route.query.currency,
      boostPaymentId: this.$q.cookies.get('boostPaymentId') || null,
      info: this.$q.localStorage.getItem('premiumCarePackage'),
      transactionId: this.$q.cookies.get('boostPaymentId') || this.$route.query.transaction_id
    }
  },
  created () {
    this.checkPayment()
  },
  mounted () {
    this.$q.cookies.remove('premiumCarePackage')
    this.$q.cookies.remove('globalStorageReviewInfoUrl')
    this.$q.cookies.remove('paymentType')
  },
  beforeDestroy () {
    this.$q.cookies.remove('boostPaymentId')
    this.$q.localStorage.remove('premiumCarePackage')
  },
  methods: {
    checkPayment () {
      if (this.boostPaymentId === null) {
        this.loaded = true
        return
      }
      this.$axios.get(`payments/boost/${this.boostPaymentId}/status`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.success = response.data.success
        this.sendImpression('Successfully Purchased', '14 - Premium Care Package', 'Product Purchase')
      }).catch(error => {
        this.success = false
        this.sendImpression('Failed Purchase', '14 - Premium Care Package', 'Product Purchase')
        this.$q.notify({
          message: 'Boost payment unsuccessful, contact customer support now!'
        })
        console.error(error)
        console.log(this.boostPaymentId)
      }).finally(() => {
        this.$q.cookies.remove('boostPaymentId')
        this.loaded = true
      })
    }
  }
}
</script>
<style lang="stylus">
.text-label
 color: #6E8CA0
 font-weight: 600
 font-size: 18px
</style>

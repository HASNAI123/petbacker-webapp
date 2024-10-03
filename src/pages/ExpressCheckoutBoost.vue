<template>
  <q-page class="row justify-center text-center" padding>
    <q-card class="col-md-6 col-xs-10 q-pa-xl">
      <q-card-main>
        <div class="q-pb-lg">
          <img class="responsive" v-if="paymentStatus === true" src="statics/images/checked.png" style="height: 100px;" alt="success icon">
          <img class="responsive" v-if="paymentStatus === false" src="statics/images/cancel.png" style="height: 100px;" alt="fail icon">
          <div class="full-width" v-if="paymentStatus === null"><q-spinner size="80px"/></div>
        </div>
        <template v-if="paymentStatus !== null">
          <h5>{{ $t('paying.is', {type: $t('boost')}) }} <span v-if="paymentStatus === false">{{ $t('not') }}</span> {{ $t('successful') }}</h5>
          <h5>{{ $t('redirect.back.to.quote') }} {{ countdown }}</h5>
        </template>
        <q-btn :label="$t('back.to.quote')" @click.native="$router.replace('/requests')" color="primary"></q-btn>
      </q-card-main>
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
      countdown: 5,
      uri: this.$q.localStorage.getItem('expressCheckoutLinkSuccess') || '/requests',
      countDownInterval: null
    }
  },
  mounted () {
    if (!this.boostPaymentId) {
      return
    }
    this.$axios.get(`payments/boost/${this.boostPaymentId}/status`, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      this.paymentStatus = response.data.success
      this.initCountDown()
    }).catch(error => {
      console.error(error)
      bugsnagClient.notify(error)
      this.initCountDown()
    })
  },
  methods: {
    initCountDown () {
      let vm = this
      vm.countDownInterval = setInterval(() => {
        vm.countdown = vm.countdown - 1
        if (vm.countdown < 1) {
          vm.$router.push({
            path: vm.uri
          })
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    clearInterval(this.countDownInterval)
  }
}
</script>

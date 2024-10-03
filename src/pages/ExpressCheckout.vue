<template>
  <q-page class="row justify-center text-center " padding>
    <q-card class="col-md-6 col-xs-10 q-pa-xl">
      <q-card-main>
        <div class="q-pb-lg">
          <img class="responsive" v-if="success" src="statics/images/checked.png" style="height: 100px;" alt="success icon">
          <img class="responsive" v-else src="statics/images/cancel.png" style="height: 100px;" alt="success icon">
        </div>
        <h5>{{ $t('paying.is', {type: type}) }} {{ $t('not') }} {{ $t('successful') }}</h5>
        <h5>{{ $t('redirect.back.to.quote') }} {{ countdown }}</h5>
        <q-btn :label="$t('back.to.quote')" @click.native="$router.replace('/requests')" color="primary"></q-btn>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
      success: this.$route.query.success,
      type: this.$route.query.type,
      countdown: 5,
      uri: this.$q.localStorage.getItem('expressCheckoutLinkSuccess') || '/requests',
      countDownInterval: null
    }
  },
  mounted () {
    let vm = this
    vm.countDownInterval = setInterval(() => {
      vm.countdown = vm.countdown - 1
      if (vm.countdown < 1) {
        vm.$router.push({
          path: vm.uri
        })
      }
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.countDownInterval)
  }
}
</script>

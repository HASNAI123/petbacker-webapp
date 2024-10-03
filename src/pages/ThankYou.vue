<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-6" v-if="!responseInfo">
      <h4 class="text-center">{{ $t('ready.to.book') }}</h4>
      <p class="q-pa-md" style="font-size: 16px;" v-html="$t('thanks.for.confirming')"></p>
      <p class="q-mb-sm q-pa-md" style="font-size: 16px;" v-html="$t('send.to.petlovers')" v-if="requestInfo"></p>
      <q-btn class="q-my-lg q-ma-md" :loading="loader" color="primary" :label="$t('button.continue')" @click="continueRequest()"/>
    </div>
    <div class="col-xs-12 text-center" v-else>
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'

export default {
  mixins: [authFlowMixin],
  data () {
    return {
      responseInfo: null,
      requestInfo: null,
      loader: true
    }
  },
  created () {
    // If we have already submitted a request, then redirect to request submitted page
    if (this.$q.localStorage.has('localStorageFormResponseInfo')) {
      this.loader = false
      this.responseInfo = this.$q.localStorage.getItem('localStorageFormResponseInfo')
      this.$router.push({ name: 'RequestSubmitted', params: {requestReference: this.responseInfo.requestInfo.requestReference} })
    } else if (this.$q.localStorage.has('localStorageRequestInfo')) {
      /**
       * If the user has a pet form request, then we proceed to save the form
       */
      if (this.$q.localStorage.has('localStoragePetInfo')) {
        let pets = this.$q.localStorage.getItem('localStoragePetInfo').petsInfo
        this._processPetForm(pets)
        return
      }

      /**
       * If the user has a form request, then we proceed to save the form
       * and redirect user to request page
       */
      this._processFormRequest(
        this.requestInfo = this.$q.localStorage.getItem('localStorageRequestInfo'),
        this.$store.state.user.preferredCurrency,
        this.$store.state.user.mobileCountryId
      )
    } else {
      this._processRedirect()
    }
  },
  methods: {
    continueRequest () {
      if (this.$q.platform.is.mobile) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        this.$router.replace({name: 'Requests'})
      }
    }
  }
}
</script>

<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-6">
      <h4><strong>{{ $t('before.you.continue') }}</strong></h4>
      <p class="text-left text-justify" v-html="$t('before.continue.text')"></p>
      <q-btn class="q-mt-md" color="primary" size="md" :label="$t('accept')" :loading="signupLoading" @click="onAccept()"/>
      <q-btn class="q-mt-md" size="md" outline :label="$t('decline')" @click="onLogout"/>
    </div>
  </q-page>
</template>

<script>
/* global bugsnagClient */
import authFlowMixin from '../mixins/authFlowMixin'

export default {
  mixins: [authFlowMixin],
  data () {
    return {
      signupLoading: false
    }
  },
  methods: {
    onLogout () {
      this.$store.commit('user/updateClearAllState')
      delete this.$axios.defaults.headers.common['Authorization']
      this.$q.localStorage.clear()
      this.$router.replace('/')
    },
    onAccept () {
      let vm = this
      vm.signupLoading = true
      let accountInfo = vm.$q.localStorage.getItem('globalStorageSignupAccountInfo')

      if (typeof accountInfo !== 'string') {
        vm.$q.notify({
          message: vm.$t('register.error'),
          type: 'negative'
        })

        bugsnagClient.notify(new Error('Account Info is empty when trying to register new user with accountInfo' + JSON.stringify(accountInfo)))

        vm.$router.replace('/')
        return
      }

      /**
       * Remove the accountInfo session to prevent from submitting again
       * in case user decided to reload the page
       */
      this.$q.localStorage.remove('globalStorageSignupAccountInfo')
      this.$axios.post(`/account?lang=${this.langToAPI(this.$store.state.user.language)}`, accountInfo)
        .then((response) => {
          this.signupLoading = !vm.signupLoading
          this.$q.localStorage.set('globalStorageAccountInfo', response.data)
          this._processLogin(
            response.data.accountInfo.id,
            response.data.accountInfo.token,
            response.data.accountInfo.avatarImage,
            response.data.accountInfo.email,
            response.data.accountInfo.preferredCurrency,
            response.data.accountInfo.mobileCountryId,
            response.data.accountInfo.language,
            response.data.accountInfo.mobileNum,
            response.data.accountInfo.mobileVerified,
            response.data.accountInfo.username,
            response.data.accountInfo.createdDate,
            response.data.accountInfo.referralCode,
            response.data.accountInfo.idVerified,
            response.data.accountInfo.selfieVerified,
            response.data.accountInfo.emailVerified,
            response.data.accountInfo.facebookVerified,
            response.data.accountInfo.googleVerified,
            response.data.accountInfo.credits,
            response.data.accountInfo.businessVerified,
            response.data.accountInfo.contactLine,
            response.data.accountInfo.contactWechat,
            response.data.accountInfo.contactWhatsapp,
            response.data.accountInfo.proVerified,
            response.data.accountInfo.serviceProvider,
            response.data.accountInfo.examCertified,
            response.data.accountInfo.sitterIntroVerified
          )
        })
        .catch(e => {
          vm.signupLoading = !vm.signupLoading
          console.log(e)
          let errorMessage = e.response.data.message || vm.$t('signup.fail')
          vm.$q.notify({
            message: errorMessage,
            type: 'negative'
          })
          setTimeout(() => {
            vm.$router.replace('/')
          }, 2000)
        })
    }
  },
  mounted () {
    this.sendImpression('Verification Start')
  }
}
</script>

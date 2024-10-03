<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-6 col-xl-4 text-center">
     <ComponentPreLoader></ComponentPreLoader>
     <h5>{{ $t('process.fb.login') }}</h5>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'
import languages from 'assets/languages.json'

export default {
  mixins: [authFlowMixin],
  created () {
    let hash = this.$route.hash
    let accessToken = ''
    if (hash.access_token) {
      accessToken = hash.access_token
    } else {
      accessToken = hash.split('&')[0].replace('#access_token=', '')
    }

    this.setMobileCountryIdAndToken(accessToken)
  },
  methods: {
    onCallFacebookLogin (accessToken, mobileCountryId) {
      let vm = this
      let pushID = this.$store.state.user.pushid || '444444'
      let accountInfo = JSON.stringify({
        'accountInfo': {
          'access_token': accessToken,
          'mobileCountryId': mobileCountryId,
          'mobileNum': '',
          'pushId': pushID,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'language': this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id,
          'appVersion': process.env.APP_VERSION,
          'referrer': this.$store.state.user.referrer,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      })

      vm.$axios.post(`account/loginfacebook?lang=${this.langToAPI(this.$store.state.user.language)}`, accountInfo).then((response) => {
        if (response.status === 200) {
          vm.$q.localStorage.set('accountInfoFacebook', response.data.accountInfo)
          vm.$q.localStorage.set('globalStorageAccountInfo', response.data)
          vm._processLogin(
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
        }
      }).catch(error => {
        console.log(error)
        let errorMessage = error.response.data.message || vm.$t('unable.auth.fb')
        let fbErrorMessage = 'active access token'

        // Override error message if we detect 'active access token'
        if (errorMessage.search(fbErrorMessage) !== -1) {
          errorMessage = vm.$t('unable.auth.fb')
        }
        vm.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
        vm.$router.replace('/')
      })
    },
    setMobileCountryIdAndToken (accessToken) {
      let countryID = this.$store.getters['user/getUserMobileCountryId']
      this.onCallFacebookLogin(accessToken, countryID)
    }
  }
}
</script>

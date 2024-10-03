<template>
  <div class="push_notification"></div>
</template>
<script>
export default {
  data () {
    return {
      isSubscribed: false,
      swRegistration: {},
      applicationServerPublicKey: 'BKhnAJ8CtG_3Zq7LtzmEHBmUj0EVQvkgNf_3Kdvsc8_7_MlULiwUQhxX79BXEeeo4_95LSDSPEANf6UN3Or0A9k',
      applicationServerPrivateKey: 'gcD6x5VNbD6UP6zo4vuzlHjr-71S6Bx4bENXWYMUKZ0',
      js_subscription_json: ''
    }
  },
  mounted () {
    // let self = this
    // navigator.serviceWorker.register('sw.js')
    //   .then(function (swReg) {
    //     console.log('Service Worker is registered', swReg)
    //     self.swRegistration = swReg
    //     self.initializeUI()
    //   })
  },
  methods: {
    initializeUI () {
      let self = this
      // Set the initial subscription value
      this.swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
          self.isSubscribed = !(subscription === null)
          // self.updateSubscriptionOnServer(subscription)
          if (self.isSubscribed) {
            console.log('User is subscribed.')
          } else {
            console.log('User is NOT subscribed.')
          }
          self.subscribeUser()
        }).catch(error => {
          console.log(error)
        })
    },
    subscribeUser () {
      if (!this.isSubscribed) {
        let self = this
        let applicationServerKey = this.urlB64ToUint8Array(this.applicationServerPublicKey)
        this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
          .then(function (subscription) {
            console.log('User is subscribed.')
            self.updateSubscriptionOnServer(subscription)
            self.isSubscribed = true
            window.open(self.$t('download.app.link'), '_blank')
          })
          .catch(function (err) {
            console.log('Failed to subscribe the user: ', err)
            window.open(self.$t('download.app.link'), '_blank')
          })
      }
    },
    updateSubscriptionOnServer (subscription) {
      if (subscription) {
        this.js_subscription_json = JSON.stringify(subscription)
        //  console.log(this.js_subscription_json)
      } else {
        this.js_subscription_json = ''
      }
      // this.$q.localStorage.set('PUSH_ID', this.js_subscription_json)
      this.$store.commit('user/updateUserPushIdState', this.js_subscription_json)
      if (this.$store.state.user.access) {
        let accountInfo = JSON.stringify({
          'accountInfo': {
            'pushId': this.js_subscription_json,
            'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
            'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
            'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
            'screenWidth': screen.width,
            'screenHeight': screen.height,
            'appVersion': process.env.APP_VERSION
          }
        })
        this.$axios.put(`account/${this.$store.state.user.uuid}`, accountInfo, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          console.log('Push ID sent')
          // this.$q.notify({
          //   message: 'Push ID sent',
          //   type: 'positive'
          // })
        }).catch(e => {
          console.log(e)
          // this.$q.notify({
          //   message: e.response.data.message,
          //   type: 'negative'
          // })
        })
      }
    },
    urlB64ToUint8Array (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }
  }
}
</script>

<template>
  <q-page class="bg-grey-1">
<!-- If Notifications Clicked Enable Later -->
    <div v-if="notificationstatus === false" @click="initializedNotification" style="margin-left:60px; display: flex; justify-content: center; align-items: center; width: 100%; max-width: 300px;">
<q-card class="full-width q-my-md shadow-2 hover-effect" style="border-radius: 10px; display: inline-block;">
  <q-card-section class="text-center" style="padding: 1; padding-left:0px; padding-right:0px">
    <span style="font-size: 16px;">
  <q-icon name="warning" color="yellow" size="18px"></q-icon> {{$t('push.off')}}
  <span class="text-primary cursor-pointer" style="padding: 3px; font-size: 16px; text-decoration: underline; font-weight: bold;">{{$t('turn.on')}}</span>
</span>
  </q-card-section>
</q-card>
</div>

  <!-- If Notifications turned off -->
  <div v-if="Notificationinfobtn === true" @click="notificationinfoSet" style="display: flex; justify-content: center; align-items: center; width: 100%;">
  <q-card class="full-width q-my-md shadow-2" style="border-radius: 10px; display: inline-block; max-width: 300px;">
    <q-card-section class="text-center" style="padding-left: 10px; padding-right: 10px;">
      <span style="font-size: 16px;">
        <q-icon name="warning" color="yellow" size="18px"></q-icon> {{$t('push.off')}}
        <span class="text-primary cursor-pointer" style="padding: 3px; font-size: 16px; text-decoration: underline; font-weight: bold;">{{$t('turn.on')}}</span>
      </span>
    </q-card-section>
  </q-card>
</div>

        <!-- Accout Settings -->
        <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('accounts')}}</q-item-label>
        <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white">
            <!-- Edit Profile -->
            <q-item clickable class="q-pl-none" @click="$router.push({name: 'EditProfile', params: {userId: $store.getters['user/getUserUuidState']}})">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('edit.profile')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Change Password -->
            <q-item clickable class="q-pl-none" @click.native="onPasswordReset">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('settings.change.password')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-spinner-dots v-if="passwordResetLoader" size="30px"></q-spinner-dots>
                    <q-icon name="chevron_right" v-else></q-icon>
                </q-item-section>
            </q-item>

            <!-- Change Preferred Currency -->
            <q-item clickable class="q-pl-none">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('settings.preferred.currency')}}</q-item-label>
                </q-item-section>

                <q-item-section class="text-capitalize font-normal" side>
                    <q-btn-dropdown flat padding="0px" :ripple="false" :loading="currencyLoader">
                        <template v-slot:label>
                            <div class="row items-center no-wrap">
                                <div class="text-label text-capitalize font-normal">
                                    {{ parseCurrency($store.getters['user/getUserPrefferedCurrency']) }}
                                </div>
                            </div>
                        </template>
                        <q-list>
                            <q-item v-for="currency in currencies" :key="currency.id" clickable v-close-popup @click="currencyChange(currency.id)">
                                {{ currency.currencyCode }}
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-item-section>
            </q-item>

            <!-- Change Preferred Language-->
            <q-item clickable class="q-pl-none">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('settings.preferred.language')}}</q-item-label>
                </q-item-section>

                <q-item-section side class="text-capitalize font-normal">
                    <q-btn-dropdown flat padding="0px" :ripple="false">
                        <template v-slot:label>
                            <div class="row items-center no-wrap">
                                <div class="text-label text-capitalize font-normal">
                                    {{ parseLanguage($store.getters['user/getCurrentLanguage']) }}
                                </div>
                            </div>
                        </template>
                        <q-list style="width: 150px;">
                            <q-item v-for="language in languageOptions" :key="language.value" clickable v-close-popup @click="changeLanguage(language.value)" >
                                {{ $t(language.label) }}
                                <img :src="language.icon" class="float-right text-right" style="position: absolute; right: 0;margin-right: 20px;" width="25px" height="25px" />
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-item-section>
            </q-item>

            <!-- Change Notification Sound -->
            <q-item clickable class="q-pl-none">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('settings.notification.sound')}}</q-item-label>
              </q-item-section>

              <q-item-section side class="text-capitalize font-normal">
                <q-btn-dropdown flat padding="0px" :ripple="false">
                  <template v-slot:label>
                      <div class="row items-center no-wrap">
                          <div class="text-label text-capitalize font-normal">
                            {{$store.getters['user/getNotificationSound']}}
                          </div>
                      </div>
                  </template>
                  <q-list>
                      <q-item v-for="(sound, index) in notificationSounds" :key="index" clickable v-close-popup @click="changeNotificationSound(sound, index + 1)" >
                        {{ sound }}
                      </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-section>
          </q-item>

          <!-- Enable Strict Job Assignments -->
          <q-item clickable class="q-px-none">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('settings.strict.job.assignments')}}</q-item-label>
                  <q-item-label caption>
                    {{$t('settings.strict.job.assignments.descriptions')}}
                  </q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-toggle v-model="strictJobAssignment" @input="onStrictJobAssignmentToggle"></q-toggle>
              </q-item-section>
          </q-item>

          <!-- Enable Always Rebroadcast Private Requests -->
          <q-item clickable class="q-px-none">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('broadcast.private.requests')}}</q-item-label>
                  <q-item-label caption>
                    {{$t('broadcast.private.requests.descriptions')}}
                  </q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-toggle v-model="alwaysRebroadcastPrivate" @input="onAlwaysRebroadcastPrivate"></q-toggle>
              </q-item-section>
          </q-item>
      </q-list>

      <!-- Privacy -->
      <!-- Blocked Accounts -->
      <!-- <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">Privacy</q-item-label>
      <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white">
          <q-item clickable class="q-pl-none" @click="$router.push({name: 'BlockedAccounts'})">
              <q-item-section>
                  <q-item-label class="font-normal">Blocked Accounts</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>
      </q-list> -->

      <!-- About -->
      <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('about')}}</q-item-label>
      <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white">
          <!-- Beta Feedback -->
          <!-- <q-item clickable class="q-pl-none" @click="openFeedbackForm">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('feedback')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item> -->

          <!-- About Us -->
          <q-item clickable class="q-pl-none" @click="openUrl(`${$t('link.href.petbacker')}/about-us`)">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('app.footer.aboutus')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>

          <!-- Rate Us on App Store -->
          <q-item clickable class="q-pl-none" @click="modalRateApp = true">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('rate.us.on.app.store')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>

          <!-- Terms of Use -->
          <q-item clickable class="q-pl-none" @click="openUrl(`${$t('link.href.petbacker')}/help-center/policies/terms-of-use`, true)">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('requests.petboarding.agreement.termsofuse')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>

          <!-- Privacy Policy -->
          <q-item clickable class="q-pl-none" @click="openUrl(`${$t('link.href.petbacker')}/help-center/policies/privacy-policy`, true)">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('requests.petboarding.agreement.privacypolicy')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>

          <!-- Version -->
          <q-item clickable class="q-pl-none">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('version')}}</q-item-label>
              </q-item-section>

              <q-item-section class="font-normal" side>{{PROCESS.APP_VERSION}}</q-item-section>
          </q-item>

          <!-- Clear Cache -->
          <q-item clickable class="q-pl-none" @click="onClearCache">
              <q-item-section>
                  <q-item-label class="font-normal">{{$t('clear.cache.title')}}</q-item-label>
              </q-item-section>

              <q-item-section side>
                  <q-item-label v-if="clearCacheLoader" class="text-position text-positive" caption>
                    <q-spinner-dots color="primary" size="md"></q-spinner-dots>
                  </q-item-label>
                  <q-icon v-else name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>
      </q-list>

      <div class="text-center q-mt-lg q-mx-lg">
        <q-img src="statics/images/pb-logo.png" class="image-upload q-mb-md" width="32%" @click="onImageClick"></q-img>
          <p class="q-my-none q-mb-lg text-grey-8">{{ $t('app.footer.copyright').replace('{year}', getCurrentYear()) }}</p>
          <q-btn color="primary" outline :label="$t('deactivate.account')" class="full-width q-mx-md q-mb-xl" @click="triggerDeactivateModal(true)"></q-btn>
      </div>

      <!-- Info Dialog -->
      <dialog-info :trigger="infoModal" @on-close="triggerInfoModal" :message="infoMessage"></dialog-info>

      <!-- App Review Dialog -->
      <dialog-app-review :trigger="modalRateApp" @on-close="triggerAppReviewModal"></dialog-app-review>

      <!-- Deactivation Dialog -->
      <dialog-deactivation-new :trigger="modalDeactivate" @on-close="triggerDeactivateModal"></dialog-deactivation-new>

  </q-page>
</template>
<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin'
import countries from 'assets/countries.json'
import moment from 'moment'
export default {
  mixins: [languageSwitcherMixin],
  components: {
    'dialog-info': () => import('components/Dialog400Error.vue'),
    'dialog-app-review': () => import('components/DialogRateApp.vue'),
    'dialog-deactivation-new': () => import('components/Deactivation/DialogDeactivation.vue')
  },
  data () {
    return {
      imageClickCount: 0,
      isLoading: false,
      info: {
        title: null,
        message: null,
        icon: null,
        type: null,
        id: null,
        requestId: null,
        jobId: null
      },
      pushNotification: null,
      notificationstatus: true,
      Notificationinfobtn: false,
      strictJobAssignment: this.$store.getters['user/getStrictJobAssignments'],
      alwaysRebroadcastPrivate: this.$store.getters['user/getAlwaysRebroadcastPrivate'],
      passwordResetLoader: false,
      currencyLoader: false,
      infoModal: false,
      infoMessage: '',
      modalDeactivate: false,
      currencies: this.$store.getters['cached/getCurrenciesCached'],
      modalRateApp: false,
      notificationSounds: [
        'Woof',
        'Meow',
        this.$t('notification.silent'),
        this.$t('notification.default')
      ],
      feedBackForms: {
        'en': `https://docs.google.com/forms/d/e/1FAIpQLSfQIAZ6g9RxwpUz2XqMvV1xMbhZjtjEUh4cZyEC27OQc75Cuw/viewform?entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_cn': `https://docs.google.com/forms/d/e/1FAIpQLSe2igQl0CEgcz1MrijgRfv9_CoZQYT_YSYviQDyoYQJy-2JzQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_tw': `https://docs.google.com/forms/d/e/1FAIpQLSdZ1nXKHCAf1rYOAK5_YbIyOXrxbcCoZJECFa-1tP9F3qreJQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_hk': `https://docs.google.com/forms/d/e/1FAIpQLSdZ1nXKHCAf1rYOAK5_YbIyOXrxbcCoZJECFa-1tP9F3qreJQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`
      },
      clearCacheLoader: false
    }
  },
  mounted () {
    this.getCurrency()
    this.notficationchecks()
    /* this.initializedNotification() */
    document.addEventListener('resume', this.onResume, false)
  },
  beforeDestroy () {
    document.removeEventListener('resume', this.onResume)
  },
  methods: {

    onImageClick () {
      console.log('Image clicked')
        this.imageClickCount++
        if (this.imageClickCount === 3) {
            this.callApi()
            this.imageClickCount = 0
        }
    },
    async callApi () {
  try {
    // Get all data from the Vuex store
    const allData = await this.$store.dispatch('chat/getAllData')
    const arrayData = allData._array
    const arrayDataJson = JSON.stringify(arrayData)
    console.log(arrayDataJson)

    // Call your API here
    const response = await this.$axios.post(`users/${this.$store.state.user.uuid}/messagesdump`, arrayDataJson, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader'],
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200 || response.status === 201) {
      console.log(response)
      console.log('Push is enabled')
      this.$q.notify('Debugging data successfully sent')
    } else {
      throw new Error('Unexpected status code: ' + response.status)
    }
  } catch (error) {
    console.error(error)
    // Handle error...
  }
},
    onResume () {
      // This function is called when the app comes back to the foreground
      console.log('App is in the foreground')
      this.notficationchecks()
    },

    notificationinfoSet () {
      this.notficationchecks()
      if (JSON.parse(localStorage.getItem('enableLater')) === true) {
        this.initializedNotification()
        localStorage.setItem('enableLater', false)
      }
      cordova.plugins.diagnostic.switchToSettings(function () {
        console.log('Successfully switched to Settings app')
      }, function (error) {
        console.error('The following error occurred: ' + error)
      })
    },

    notficationchecks () {
      window.cordova.plugins.diagnostic.isRemoteNotificationsEnabled((enabled) => {
        if (enabled) {
          console.log('Remote notifications are enabled')
          this.Notificationinfobtn = false
          console.log('check notificationsid', this.$store.state.user.pushid)
          this.registerpush()
        } else {
          console.log('Remote notifications are not enabled')
          this.Notificationinfobtn = true
        }
      }, (error) => {
        console.error('The following error occurred: ' + error)
      })
    },

    initializedNotification () {
      console.log('intialzie started for chceking')
      if (this.pushNotification) {
        return
      }
      this.isLoading = true

      // create channel for Android Version 8.0 above
      this.checkNotificationsChannel().then(() => {
        if (window.PushNotification) {
          console.log('PushNotification is installed correctly.')
        } else {
          console.log('PushNotification is not installed or not loaded correctly.')
        }
        console.log('check', cordova.plugins.permissions)
        var permissions = cordova.plugins.permissions
        permissions.requestPermission(permissions.POST_NOTIFICATIONS, success, error)

        function error () {
          console.warn('notificaiton permission is not turned on')
        }

        function success (status) {
          if (!status.hasPermission) error()
        }
        console.log('check the notification channle', window.PushNotification)
        this.pushNotification = window.PushNotification.init({
          android: {
            sound: true,
            vibrate: true,
            clearBadge: true,
            forceShow: true
          },
          ios: {
            voip: false,
            alert: true,
            badge: true,
            sound: true,
            vibrate: true,
            clearBadge: true
          }
        })
      }).then(() => {
        if (window.PushNotification) {
          console.log('PushNotification is installed correctly.')
        } else {
          console.log('PushNotification is not installed or not loaded correctly.')
        }
        // on push registration
        this.pushNotification.on('registration', (data) => {
          console.log(data)
          if (data.registrationId !== this.$store.getters['user/getUserPushIdState']) {
            this.$store.commit('user/updateUserPushIdState', data.registrationId)
          }
        })
        console.log('check push notfication prop', this.pushNotification)
        console.dir(this.pushNotification)
        console.log(JSON.stringify(this.pushNotification, null, 2))
        // on push notifications
        this.pushNotification.on('notification', this.onNotified)

        // on push notifications error
        this.pushNotification.on('error', (e) => {
        // e.message
          console.error(e)
          console.log('error coming and ther eerror is :', e)
        })
      }).catch((error) => {
        console.error(error)
      })
      setTimeout(() => {
        this.registerpush()
      }, 15000)
      this.notificationstatus = true
    },

    checkNotificationsChannel () {
      console.log('check channel ', window.PushNotification)
      return new Promise((resolve, reject) => {
        if (this.$q.platform.is.android && parseInt(window.device.version) >= 8) {
          window.PushNotification.listChannels(channels => {
            let status = this.$_.findWhere(channels, {'id': 'notification_woof_petbacker_android'})

            if (status === undefined) {
            // woof sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_woof_petbacker_android created!')
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_woof_petbacker_android',
                description: 'Android Channel For Woof Notification Sound',
                importance: 4,
                sound: 'woof',
                vibration: true
              })

              // meow sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_meow_petbacker_android created!')
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_meow_petbacker_android',
                description: 'Android Channel For Meow Notification Sound',
                importance: 4,
                sound: 'meow',
                vibration: true
              })

              // silent sound channel
              window.PushNotification.createChannel(() => {
                console.log('notificatiosn channel notification_silent_petbacker_android created!')
                resolve()
              }, () => {
                console.log('error')
                resolve()
              }, {
                id: 'notification_silent_petbacker_android',
                description: 'Android Channel For Silent Notification Sound',
                importance: 4,
                sound: 'silent',
                vibration: true
              })
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    registerpush () {
      let accountInfo = {
        'accountInfo': {
          'pushId': this.$store.state.user.pushid,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'appVersion': process.env.APP_VERSION,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      }
      this.$axios.post(`account/enablepush`, accountInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response)
          console.log('Push is enabled')
        } else {
          throw new Error('Unexpected status code: ' + response.status)
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    onClearCache () {
      this.clearCacheLoader = true

      // clear chat cache
      this.$store.dispatch('chat/clear')

      // clear search
      this.$store.dispatch('search/clearSearchCache')

      // clear inbox
      this.$store.dispatch('cached/clearInboxPageCached')

      // clear bookings info
      this.$store.dispatch('bookings/clear')

      setTimeout(() => {
        this.clearCacheLoader = false

        this.$q.notify({
          message: this.$t('cache.successfully.cleared'),
          position: 'top',
          type: 'positive'
        })
      }, 1000)
    },
    triggerDeactivateModal (status) {
      this.modalDeactivate = status
    },
    openFeedbackForm () {
      if (this.feedBackForms[this.$store.getters['user/getCurrentLanguage']] !== undefined) {
        this.openUrl(this.feedBackForms[this.$store.getters['user/getCurrentLanguage']])
      } else {
        this.openUrl(this.feedBackForms['en'])
      }
    },
    changeNotificationSound (soundName, value) {
      this.$store.commit('user/updateNotificationSound', soundName)
      let info = {
        'accountInfo': {
          'notificationSound': value
        }
      }

      this.$axios.put(`/account/${this.$store.getters['user/getUserUuidState']}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
      // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.infoMessage = error.response.data.message
          this.infoModal = true
        }
      })
    },
    triggerAppReviewModal (status) {
      this.modalRateApp = status
    },
    getCurrency () {
      this.$axios.get(`currencies`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (JSON.stringify(this.$store.getters['cached/getCurrenciesCached']) !== JSON.stringify(response.data.currencies.items)) {
          this.currencies = response.data.currencies.items
          this.$store.dispatch('cached/cacheCurrencies', response.data.currencies.items)
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    currencyChange (countryId) {
      this.$store.commit('user/updateUserPreferredCurrencyState', parseInt(countryId))
      this.currencyLoader = true
      this.infoMessage = ''
      let info = {
        'accountInfo': {
          'preferredCurrency': this.$store.getters['user/getUserPrefferedCurrency']
        }
      }

      this.$axios.put(`/account/${this.$store.getters['user/getUserUuidState']}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.infoMessage = this.$t('currency.change.prompt')
        this.infoModal = true

        // update wallet
        this.$store.dispatch('user/refreshWallet')

        // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.infoMessage = error.response.data.message
          this.infoModal = true
        }
      }).finally(_ => {
        setTimeout(() => {
          this.currencyLoader = false
        }, 800)
      })
    },
    changeLanguage (language) {
      this.$store.commit('user/updateUserLanguageState', language)
      this.$store.dispatch('banners/clearBannersCache')
      this.$emit('toggleLanguageChange')
      this.$route.query.lang = language
      this.updateLanguageIcon()
    },
    updateLanguageIcon () {
    //  check language change from url
      if (typeof (this.$route.query.lang) !== 'undefined') {
        this.$store.commit('user/updateUserLanguageState', this.$route.query.lang)
      }

      switch (this.$store.getters['user/getCurrentLanguage']) {
        case 'zhcn': this.$store.state.user.language = 'zh_cn'; break
        case 'zh_cn': break
        case 'zhtw': this.$store.state.user.language = 'zh_tw'; break
        case 'zh_tw': break
        case 'zhhk': this.$store.state.user.language = 'zh_hk'; break
        case 'zh_hk': break
        case 'de': this.$store.state.user.language = 'dede'; break
        case 'dede': break
        case 'th': this.$store.state.user.language = 'thth'; break
        case 'thth': break
        case 'fr': this.$store.state.user.language = 'frfr'; break
        case 'frfr': break
        case 'es': this.$store.state.user.language = 'eses'; break
        case 'eses': break
        case 'it': this.$store.state.user.language = 'itit'; break
        case 'itit': break
        case 'sk': this.$store.state.user.language = 'sksk'; break
        case 'sksk': break
        case 'ja': this.$store.state.user.language = 'jajp'; break
        case 'jajp': break
        case 'cs': this.$store.state.user.language = 'cscz'; break
        case 'cscz': break
        case 'id': this.$store.state.user.language = 'idid'; break
        case 'idid': break
        case 'ms': this.$store.state.user.language = 'msmy'; break
        case 'msmy': break
        case 'el': this.$store.state.user.language = 'elel'; break
        case 'elel': break
        case 'pt': this.$store.state.user.language = 'ptpt'; break
        case 'ptpt': break
        default: this.$store.state.user.language = 'en'
      }

      //  update database
      this.switchLocale(this.$store.state.user.language, true)
    },
    triggerInfoModal (status) {
      this.infoModal = status
      this.infoMessage = ''
    },
    parseCurrency (currencyId) {
      return this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
    },
    parseLanguage (languageValue) {
      return this.$t(this.$_.findWhere(this.languageOptions, {'value': languageValue}).label)
    },
    onStrictJobAssignmentToggle (status) {
      let info = {
        'accountInfo': {
          'strictJobAssignments': status
        }
      }

      this.$axios.put(`/account/${this.$store.getters['user/getUserUuidState']}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
      // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.infoMessage = error.response.data.message
          this.infoModal = true
        }
      })
    },
    onAlwaysRebroadcastPrivate (status) {
      let info = {
        'accountInfo': {
          'alwaysRebroadcastPrivate': status ? 1 : 0
        }
      }

      this.$axios.put(`/account/${this.$store.getters['user/getUserUuidState']}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
      // update user states
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.infoMessage = error.response.data.message
          this.infoModal = true
        }
      })
    },
    onPasswordReset () {
      this.infoMessage = ''
      this.passwordResetLoader = true
      let info = {
        'accountInfo': {
          'email': this.$store.getters['user/getUserEmail'],
          'mobileCountryId': this.$store.getters['user/getUserMobileCountryId'],
          'mobileNum': this.$store.getters['user/getUserMobileNum'],
          'deviceLanguage': this.$store.getters['user/getCurrentLanguage']
        }
      }

      this.$axios.post(`/account/passwordrequest?lang=${this.$store.getters['user/getCurrentLanguage']}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.infoMessage = this.$t('change.password.prompt')
        this.infoModal = true
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.infoMessage = error.response.data.message
          this.infoModal = true
        }
      }).finally(_ => {
        setTimeout(() => {
          this.passwordResetLoader = false
        }, 800)
      })
    },
    getCurrentYear () {
      return moment().year()
    }
  }
}
</script>

<style lang="stylus" scoped>
.hover-effect
 transition background-color 0.3s ease

.hover-effect:hover
 background-color #D3D3D3
.protection-bulb
 position: absolute
 top: 0
 left: calc(50% - 35px)
 padding: 10px
 background:  #fff
 width: 70px
 border-radius: 50%
 margin-top: -35px;
.protection-bulb-image
 width: 50px
</style>

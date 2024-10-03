import moment from 'moment'
export default ({ Vue }) => {
  Vue.mixin({
    data () {
      return {
        PROCESS: process.env
      }
    },
    mounted () {
      // hook function into events
      // listens for deeplink (custom url)
      window.handleOpenURL = this.handleDeepLinkUrl
      if (this.$store) {
        switch (this.$store.getters['user/getCurrentLanguage']) {
          case 'frfr':
            moment.locale('fr')
            break
          default:
            moment.locale('en')
            break
        }
      }
    },
    methods: {
      /**
       * Send Impression to Google Analytics
       * @param {String} action type of action
       * @param {String} label label
       * @param {String} category category
       * @param {String} event default as trackEvent
       */
      sendImpression (action, label = '', category = 'Request Submission', event = 'trackEvent') {
        if (!action) {
          console.error('Action not specified. Unable to proceed sending impression')
          return
        }

        console.info(`Sending impression action: ${action} label: ${label} category: ${category} event: ${event}`)

        // Check if it's a new user
        const isNewUser = !localStorage.getItem('visitedBefore')

        if (isNewUser && !localStorage.getItem('uuid')) {
          console.log('This is the first login.')

          // Create the eventInfo object
          let eventInfo = {
            eventInfo: {
              event: event,
              category: 'Tracking New User',
              action: 'first Launch',
              label: 'Launch track',
              uuid: localStorage.getItem('uuid'),
              deviceId: this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid'),
              lat: this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude'],
              lng: this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude'],
              platform: this.$q.platform.is.cordova ? window.device.platform : 'WEB',
              model: this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
              appVersion: process.env.APP_VERSION,
              countryID: this.$store.getters['user/getUserMobileCountryId'],
              vendor: this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5
            }
          }

          this.$axios.post('/analytic/event', eventInfo)
            .then((response) => {
              console.log('impression sent successfully')
            })
            .catch((error) => {
              console.error('Error uploading image', error)
            })

          // Set the "visitedBefore" flag in local storage to indicate that the user has visited before
          localStorage.setItem('visitedBefore', 'true')
        } else {
          // Actions for subsequent logins
          console.log('Logged in before')
        }

        let eventInfo = {
          eventInfo: {
            event: event,
            category: category,
            action: action,
            label: label,
            uuid: localStorage.getItem('uuid'),
            deviceId: this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid'),
            lat: this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude'],
            lng: this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude'],
            platform: this.$q.platform.is.cordova ? window.device.platform : 'WEB',
            model: this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
            appVersion: process.env.APP_VERSION,
            countryID: this.$store.getters['user/getUserMobileCountryId'],
            vendor: this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5
          }
        }

        this.$axios.post('/analytic/event', eventInfo)
          .then((response) => {
            console.log('impression sent successfully')
          })
          .catch((error) => {
            console.error('Error uploading image', error)
          })
      },

      forceLogout (error) {
        if (error.response && error.response.data.status === 401) {
          //  this.$store.commit('user/updateClearAllState')
          //  delete this.$axios.defaults.headers.common['Authorization']
          this.sendImpression('Loggout', 'Auth flow')
          this.$store.dispatch('user/forceRelogin')
          this.$q.localStorage.clear()
          if (this.$route.query._ga) {
            let ga = {
              '_ga': this.$route.query._ga
            }
            this.$router.replace({ name: 'Index', query: ga })
          } else {
            this.$router.replace({name: 'Index'})
            this.sendImpression('Loggout', 'Auth flow')
          }
        } else if (error.response && error.response.data.status === 410) {
          // gone api request (indicating the requested content no longer available)
          this.$router.go(-1)
        } else if (error.response && error.response.data.status === 403) {
          // forbidden api request
          this.$router.go(-1)
        }
      },
      /**
       * Trigger in App Review
       */
      triggerInAppReview () {
        window.cordova.plugins.InAppReview.requestReviewDialog().catch(() => {
          return window.cordova.plugins.InAppReview.requestReview()
        })
      },
      langToAPI (lang) {
        lang = lang.toLowerCase().replace('-', '').replace('_', '')
        let langs = {
          '': 'en',
          'en': 'en',
          'zhcn': 'zh-CN',
          'msmy': 'ms-my',
          'eses': 'es-es',
          'jajp': 'ja-JP',
          'dede': 'de-de',
          'zhtw': 'zh-TW',
          'thth': 'th',
          'kokr': 'ko_kr',
          'frfr': 'fr-fr',
          'ptpt': 'pt-PT',
          'nlnl': 'nl-NL',
          'enmy': 'en-my',
          'ensg': 'en-sg',
          'enie': 'en-ie',
          'idid': 'id-id',
          'sksk': 'sk-SK',
          'he': 'he',
          'itit': 'it-IT',
          'cscz': 'cs-CZ',
          'zhhk': 'zh-HK',
          'elel': 'el-el'
        }
        return langs[lang]
      },
      /**
       * Trigger in App Browser. It will fall back to
       * trigger window.open when in App Browser is not available
       * @param {String} url link to be open
       * @param {Boolean} readerMode activate reader mode (default false)
       */
      openUrl (url, readerMode, name = 'link-clicked', location) {
        this.sendImpression('clicked on url', 'link' + url)
        if (!url) {
          return
        }

        // append analytics tracking
        let separator = url.indexOf('?') === -1 ? '?' : '&'
        url += `${separator}utm_source=${this.$q.platform.is.cordova ? window.device.platform : 'Webapp'}&utm_medium=${this.$q.platform.is.cordova ? 'app' : 'web'}&utm_campaign=${encodeURIComponent(name)}${location ? `&utm_content=${encodeURIComponent(location)}` : ''}`

        if (this.$q.platform.is.cordova) {
          const self = this
          window.SafariViewController.isAvailable((available) => {
            if (available) {
              window.SafariViewController.show({
                url: url,
                hidden: false, // default false. You can use this to load cookies etc in the background (see issue #1 for details).
                animated: true, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
                transition: 'slide', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
                enterReaderModeIfAvailable: readerMode, // default false
                tintColor: '#ffffff', // default is ios blue
                barColor: '#ffffff', // on iOS 10+ you can change the background color as well
                controlTintColor: '#9B89B9' // on iOS 10+ you can override the default tintColor
              },
              // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
              function (result, vueInstance) {
                if (result.event === 'opened') {
                  console.log('InAppBrowser [global-mixin.js]: opened')
                } else if (result.event === 'loaded') {
                  console.log('InAppBrowser [global-mixin.js]: loaded')
                  console.log('InAppBrowser data received: ' + url)
                } else if (result.event === 'closed') {
                  console.log('InAppBrowser [global-mixin.js]: closed')
                  console.log(self)
                  self.sendImpression('closed', 'link' + url)

                  // Emits events upon In App Browser Closed
                  let svcEvent = new CustomEvent('SVC-closed', {
                    detail: {url: url}
                  })
                  window.dispatchEvent(svcEvent)
                }
              },
              function (msg) {
                console.log('KO: ' + msg)

                if (url) {
                  console.log(url)
                  // check for deeplinks
                  if (url.match(/petbacker:\/\//g)) {
                    window.handleOpenURL(url)
                  } else {
                    window.open(url, '_system')
                  }
                }
              })
            } else {
              window.open(url, '_system', 'location=no')
            }
          })
        } else {
          window.open(url, '_system', 'location=no')
        }
      },
      dismissSafari () {
        window.SafariViewController.hide()
        console.log('dismiss')
      },
      /**
       * Deeplink redirections
       * @param {String} url deeplink received
       */
      handleDeepLinkUrl (url) {
        // Handle Deeplinks here
        window.SafariViewController.hide()

        // Emits events upon In App Browser Closed
        let svcEvent = new CustomEvent('SVC-closed', {
          detail: {url: url}
        })
        window.dispatchEvent(svcEvent)

        console.log('deep link: ' + url)

        // get redirect path
        let path = url.split('//')
        path = path[path.length - 1]
        console.log(path)

        // get query payload
        path = path.split('?')
        console.log(path)

        let redirectPath = path[0]
        let params = {}
        console.log(path.length)
        if (path.length > 1) {
          let queries = path[1].split('&')
          console.log('queries: ' + queries)
          console.log(queries.length)
          if (queries.length > 1) {
            queries.forEach((query) => {
              let item = query.split('=')
              params[item[0]] = decodeURIComponent(item[1])
            })
          } else {
            let item = queries[0].split('=')
            console.log(item[0] + ' ' + item[1])
            params[`${item[0]}`] = decodeURIComponent(item[1])
          }
          console.log('params: ' + JSON.stringify(params))
          console.log(params)
        }

        // to detect checkout redirect path
        let longPath = redirectPath.split('/')
        if (longPath.length > 1) {
          redirectPath = longPath[longPath.length - 1]
        }
        console.log('redirect path: ' + redirectPath)

        let routeInfo = null
        try {
          routeInfo = this.$router.resolve({name: 'MobileDashboard'})
        } catch (error) {
          console.error(error)
        }

        // redirect user according to path and payload
        switch (redirectPath) {
          case 'pets':
            routeInfo = this.$router.resolve({name: 'MyPets'})
            break
          case 'wallet':
            routeInfo = this.$router.resolve({name: 'AccountHistory'})
            break
          case 'voucher':
            setTimeout(() => {
              this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
            }, 200)
            routeInfo = this.$router.resolve({name: 'MobileDashboard', query: {voucher: 1}})
            break
          case 'referrals':
            if (params['code']) {
              // redirects to one specific moment
              routeInfo = this.$router.resolve({name: 'ReferralSignup', query: {code: params['code'], sitter: params['sitter'] || 0}})
            } else {
              // redirect to moments feed
              routeInfo = this.$router.resolve({name: 'Referrals'})
            }
            break
          case 'stories':
            // redirect to moment feed
            if (params['id']) {
              // redirects to one specific stories
              routeInfo = this.$router.resolve({name: 'MomentPost', params: {momentId: params['id']}})
            } else {
              setTimeout(() => {
                this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.moments')
              }, 200)
              // redirect to trigger create story dialog
              routeInfo = this.$router.resolve({name: 'MobileDashboard', query: {createstory: 1}})
            }
            break
          case 'moment':
            if (params['id']) {
              // redirects to one specific moment
              routeInfo = this.$router.resolve({name: 'MomentPost', params: {momentId: params['id']}})
            } else {
              // redirect to moments feed
              setTimeout(() => {
                this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.moments')
              }, 200)
              routeInfo = this.$router.resolve({name: 'MobileDashboard'})
            }
            break
          case 'badges':
            routeInfo = this.$router.resolve({name: 'Badges'})
            break
          case 'balance':
            routeInfo = this.$router.resolve({name: 'AccountHistory'})
            break

          case 'profile':
            routeInfo = this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
            break
          case 'steps':
            routeInfo = this.$router.resolve({name: 'StepsLeft'})
            break
          case 'identity':
            if (params['id']) {
              // prompt to upload specific identity type
              routeInfo = this.$router.resolve({name: 'IdentityVerification', query: {type: params['id']}})
            } else {
              // redirect to identity verification
              routeInfo = this.$router.resolve({name: 'IdentityVerification'})
            }
            break
          case 'notifications':
            if (params['id']) {
              // redirects to one specific notification
              routeInfo = this.$router.resolve({name: 'Notification', params: {id: params['id']}})
            } else {
              // redirect to notification inbox
              routeInfo = this.$router.resolve({name: 'Notifications'})
            }
            break
          case 'support':
            if (params['id']) {
              // redirect to ticket chat room
              routeInfo = this.$router.resolve({name: 'ChatSupport', params: {ticketId: params['id']}})
            } else {
              // redirect to support enquiry
              routeInfo = this.$router.resolve({name: 'ChatSupportHelp'})
            }
            break
          case 'help':
            // redirect to help center
            routeInfo = this.$router.resolve({name: 'HelpCenter'})
            break
          case 'chat':
            if (params['requestId'] && params['jobId']) {
              // redirect to request chat
              routeInfo = this.$router.resolve({name: 'Chat', params: {request: params['requestId'], response: params['jobId']}})
            } else if (params['jobId']) {
              // redirect to job chat
              routeInfo = this.$router.resolve({name: 'JobChat', params: {taskId: params['jobId']}})
            } else {
              // redirect to support chat
              routeInfo = this.$router.resolve({name: 'ChatSupport', params: {ticketId: 0}})
            }
            break
          case 'job':
            setTimeout(() => {
              this.$store.commit('user/updateUserCurrentMobileTab', 'mobile.navbar.jobs')
            }, 200)
            if (params['jobId'] || params['id']) {
              // redirect to job summary
              routeInfo = this.$router.resolve({name: 'JobSummary', params: {taskId: params['jobId'] || params['id']}})
            } else {
              routeInfo = this.$router.resolve({name: 'MobileDashboard'})
            }
            break
          case 'createrequest':
          case 'request':
            setTimeout(() => {
              this.$store.commit('user/updateUserCurrentMobileTab', 'mobile.navbar.requests')
            }, 200)
            if (params['promo_code']) {
              // redirect to service
              routeInfo = this.$router.resolve({name: 'Services', query: {promo: params['promo_code']}})
            } else if (params['requestId'] || params['id']) {
              // redirect to request summary
              routeInfo = this.$router.resolve({name: 'RequestSummary', params: {requestId: params['requestId'] || params['id']}})
            } else {
              routeInfo = this.$router.resolve({name: 'MobileDashboard'})
            }
            break
          case 'boost':
          case 'checkout':
            // Emits events upon In App Browser Closed
            let svcEvent = new CustomEvent('Payment-Status', {
              detail: {status: params['success']}
            })
            window.dispatchEvent(svcEvent)
            break
          case 'rebooking':
            // redirect to rebooking page
            routeInfo = this.$router.resolve({name: 'Rebooking'})
            break
          case 'sponsor':
            // redirect to sponsor page
            routeInfo = this.$router.resolve({name: 'Sponsor'})
            break
        }

        console.log(routeInfo)
        if (longPath.length <= 1) {
          /**
           * Allow redirect from deeplink to request page if already login or
           * the requested page does not required user to be login
           * (meta in route does have not 'requiresAuth' key)
           */
          setTimeout(() => {
            if (this.$store.getters['user/getUserAccessState'] || this.$_.isEmpty(routeInfo.route.meta)) {
              if (routeInfo.location.name === 'MobileDashboard' && this.$route.name === 'MobileDashboard') {
                this.$router.replace(routeInfo.location)
                return
              }
              this.$router.push(routeInfo.location)
            } else if (routeInfo.route.meta.requiresAuth) {
              // cache redirection page to redirect user to correct page after login
              this.$store.commit('user/updateUserBackUrlState', routeInfo.location)
            }
          }, 250)
        }
      }
    }
  })
}

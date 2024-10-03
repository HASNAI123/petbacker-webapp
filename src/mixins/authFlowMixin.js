/* global bugsnagClient */
import countryLists from 'assets/countries.json'
import languageSwitcherMixin from '../mixins/languageSwitcherMixin'
import languages from 'assets/languages.json'
import createPetForm from 'assets/form-create-pet.json'

export default {
  mixins: [languageSwitcherMixin],
  components: {
    'dialog-error': () => import('components/DialogError.vue')
  },
  data () {
    return {
      mobileCountryId: this.$store.getters['user/getUserMobileCountryId'],
      fbloading: false,
      googleLoading: false,
      appleLoading: false,
      petsId: [],
      promises: []
    }
  },
  mounted () {
    if (!this.$q.platform.is.cordova) {
      this.loadGoogleOAuth()
    }
  },
  beforeDestroy () {
    this.fbloading = false
    this.googleLoading = false
    this.appleLoading = false
  },
  methods: {
    async _processPetForm (pets) {
      console.log('check ifpets coming', pets)
      for (let i = 0; i < pets.length; i++) {
        if (pets[0][i] === null || pets[0][i] === undefined) {
          console.log('pets[0][i] is null or undefined. Breaking out of the loop.')
          break
        }
        // prepare pet form to be submitted
        console.log('check pets object', pets)
        console.log('check pets object inside', pets[0])
        console.log('check the value of i', i)
        console.log('check pets object inside again', pets[0][0])
        console.log('check pets object inside again', pets[0][i])
        let petDescription = JSON.stringify(this.createFormConversion(pets[0][i]))
        console.log('check each pet descripption', petDescription)
        let newPetForm = {
          'personalItemsInfo': {
            'title': pets[0][i].type,
            'itemDescription': petDescription,
            'media': [
              {
                'type': 'image',
                'filename': ''
              }
            ]
          }
        }
        console.log('Check the petform goign inside the api in flowmixin', newPetForm)
        // submit pet form
        let apiCall = await this.$axios.post(`users/${this.$store.state.user.uuid}/personal-items?v=6`, newPetForm, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          let newPet = {
            'id': response.data.wallInfo.personalItemId,
            'title': response.data.wallInfo.title
          }
          this.petsId.push(newPet)
        }).catch((error) => {
          console.error(error)
        })

        this.promises.push(apiCall)
      }

      this.$q.localStorage.remove('localStoragePetInfo')

      /**
       * run following code only after all promises (personal item API call) have done
       * to ensure new pets created are successfully submitted
       */
      Promise.all(this.promises).then(() => {
        let petTitle = []
        let petID = []
        for (let a = 0; a < this.petsId.length; a++) {
          petID.push(this.petsId[a].id)
          petTitle.push(this.petsId[a].title)
        }

        // insert pet ids into current request form
        let form = this.$q.localStorage.getItem('localStorageRequestInfo')
        let formDescription = JSON.parse(form.requestInfo.requestDescriptionJson).question

        formDescription[1].reply = petTitle.join(',')
        formDescription[1].selectedIndex = petID

        form.requestInfo.requestDescriptionJson = JSON.stringify({'question': formDescription})

        return form
      }).then((form) => {
        // proceed to submit request form
        this._processFormRequest(
          form,
          this.$store.getters['user/getUserPrefferedCurrency']
        )
      }).catch(error => {
        console.error(error)
      })
    },
    _processFormRequest (formRequest, preferredCurrency) {
      console.log('check the form which being sent', formRequest)
      formRequest.requestInfo.preferredCurrency = preferredCurrency
      this.sendImpression('Request Submitting', this.getCountryShortName(formRequest.requestInfo.countryId))
      this.$axios.post(`users/${this.$store.state.user.uuid}/requests/direct?v=6`, JSON.stringify(formRequest), {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        console.log('check esponse after login to see', response.data)
        this.$q.localStorage.set('localStorageFormResponseInfo', response.data)

        // User still hasn't verify email
        if (!this.$store.state.user.email) {
          this.$router.replace('/user/confirm-email')
          console.log('user not verified mail')
          return
        }
        console.log('request submitted page', response.data.requestInfo.requestReference)
        this.$router.push({ name: 'RequestSubmitted', params: {requestReference: response.data.requestInfo.requestReference} })
      }).catch(e => {
        console.log(e)
        let errorMessage = this.$t('form.fails')
        if (e.response.data.message) {
          errorMessage = e.response.data.message
        }
        this.$q.notify({
          message: errorMessage,
          timeout: 3000
        })
        let lang = this.$store.getters['user/getCurrentLanguage']
        let postForm = formRequest
        let API = `users/${this.$store.state.user.uuid}/requests/direct`
        bugsnagClient.notify(e, {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang,
                form: postForm,
                post: API
              }
            }
          }
        })
        this._processRedirect()
      })
      this.$q.localStorage.remove('localStorageRequestInfo')
    },
    _processDonationRequest (currency, amount) {
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=${currency}&price=${amount}&item=Stray%20Dog%20Day&payment_method_id=2&is_web=1&product_id=13&redirect_success_url=https%3A%2F%2Fweb.petbacker.com%2Fcampaigns%2Fstray-dog-day-2020%2Fpaymentsuccess%3Fcurrency%3D${currency}%26uname%3Dchi04%26pname%3DStray+dog+promo%26amount%3D${amount}&redirect_cancelled_url=https%3A%2F%2Fweb.petbacker.com%2Fcampaigns%2Fstray-dog-day-2020%2Fpayment%3Fcurrency%3D${currency}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        window.open(response.data.expressCheckoutInfo.paymentUrl, '_self')
      }).catch(error => {
        // redirect back to payment page
        if (this.$q.cookies.has('globalStorageReviewInfoUrl')) {
          let redirectUrl = this.$q.cookies.get('globalStorageReviewInfoUrl')
          this.$router.replace(redirectUrl)
        }
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    _processSubscriptionRequest (currency, price, title, productId, coutryId) {
      this.$axios.get(`users/${this.$store.state.user.uuid}/expresscheckout?currency=${currency}&price=${price}&item=${encodeURI(title)}&payment_method_id=2&product_id=${productId}&is_web=1&redirect_success_url=${window.location.origin}%2Fsubscriptions%2Fpayment-success%3Fcurrency%3D${currency}%26success%3D1&redirect_cancelled_url=${window.location.origin}%2Fsubscriptions%2Fpremium-protection%3Fcountry_id%3D${coutryId}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        window.open(response.data.expressCheckoutInfo.paymentUrl, '_self')
      }).catch(error => {
        // redirect back to payment page
        if (this.$q.cookies.has('globalStorageReviewInfoUrl')) {
          let redirectUrl = this.$q.cookies.get('globalStorageReviewInfoUrl')
          this.$router.replace(redirectUrl)
        }
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    _processBoostPayment (currency, price, title, productId) {
      let boostSprintf = `payments/boost/initiate?currency=%s&amount=%s&remark=%s&productid=${productId}&payment_method_id=6&redirectURL=%s`
      let boostUrl = boostSprintf.sprintf(
        currency,
        price,
        encodeURI(title),
        `${window.location.origin}/subscriptions/payment-success?currency=${currency}`
      )

      this.$axios.get(boostUrl, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.cookies.set('boostPaymentId', response.data.paymentId)
        window.location.href = response.data.checkoutURI
      }).catch(error => {
        // redirect back to payment page
        if (this.$q.cookies.has('globalStorageReviewInfoUrl')) {
          let redirectUrl = this.$q.cookies.get('globalStorageReviewInfoUrl')
          this.$router.replace(redirectUrl)
        }
        let errorMessage = error.response.data.message ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      })
    },
    _processRedirect () {
      if (this.$q.cookies.get('globalStorageReviewInfoUrl')) {
        let redirectUrl = this.$q.cookies.get('globalStorageReviewInfoUrl')
        this.$router.replace(redirectUrl)
        return
      }

      if (this.$store.state.user.backUrl && this.$store.state.user.uuid) {
        let backUrl = this.$store.state.user.backUrl
        this.$store.commit('user/updateUserBackUrlState', null)
        this.$router.replace(backUrl)
      } else {
        setTimeout(() => {
          this.$router.replace({name: 'MobileDashboard'})
        }, 10)
      }
    },
    _processGuest ({language}) {
      this.$store.commit('user/updateUserCurrentMobileTab', 'services.explore')
      this.$store.commit('user/updateUserNavbarVisibilityState', this.$store.getters['user/getNavbarVisibility'])
      this.$store.commit('user/updateUserAvatarImageState', 'statics/images/avatar_blue2.jpg')
      this.$store.commit('user/updateUserPreferredCurrencyState', this.$store.getters['user/getUserMobileCountryId'] || 234)
      this.$store.commit('user/updateUserLanguageState', this.$_.findWhere(languages, {'id': parseInt(language)}).value)
      this.$store.commit('user/updateGuestAccessState', true)
      this.sendImpression('Login as Guest', 'Login track')

      this._processRedirect()
    },
    _processLogin (
      uuid,
      token,
      avatarImage,
      email,
      preferredCurrency,
      mobileCountryId,
      language,
      mobileNum,
      mobileVerified,
      username,
      createdDate,
      referralCode,
      idVerified,
      selfieVerified,
      emailVerified,
      facebookVerified,
      googleVerified,
      credits,
      businessVerified,
      contactLine,
      contactWechat,
      contactWhatsapp,
      proVerified,
      serviceProvider,
      examCertified,
      sitterIntroVerified
    ) {
      /**
       * Persist the login state of the user and change navbar to show login menus
       */
      this.$store.commit('user/updateUserUuidState', uuid)
      localStorage.setItem('uuid', uuid)
      this.$store.commit('user/updateUserTokenState', token)
      this.$store.commit('user/updateUserAvatarImageState', avatarImage)
      this.$store.commit('user/updateUserEmailState', email)
      this.$store.commit('user/updateUserPreferredCurrencyState', preferredCurrency)
      this.$store.commit('user/updateUserMobileCountryIdState', mobileCountryId)
      this.$store.commit('user/updateUserLanguageState', this.$_.findWhere(languages, {'id': language}).value)
      this.$store.commit('user/updateUserMobileNumState', mobileNum)
      this.$store.commit('user/updateuserMobileVerifiedState', parseInt(mobileVerified))
      this.$store.commit('user/updateUserUsernameState', username)
      this.$store.commit('user/updateUserCreatedDateState', createdDate)
      this.$store.commit('user/updateUserReferralCodeState', referralCode)
      this.$store.commit('user/updateIdVerified', parseInt(idVerified))
      this.$store.commit('user/updateSelfieVerified', parseInt(selfieVerified))
      this.$store.commit('user/updateEmailVerified', parseInt(emailVerified))
      this.$store.commit('user/updateFacebookVerified', parseInt(facebookVerified))
      this.$store.commit('user/updateGoogleVerified', parseInt(googleVerified))
      this.$store.commit('user/updateCredits', credits)
      this.$store.commit('user/updateBusinessVerified', parseInt(businessVerified))
      this.$store.commit('user/updateContactLine', contactLine)
      this.$store.commit('user/updateContactWechat', contactWechat)
      this.$store.commit('user/updateContactWhatsapp', contactWhatsapp)
      this.$store.commit('user/updateProVerified', proVerified)
      this.$store.commit('user/updateServiceProvider', Boolean(serviceProvider))
      this.$store.commit('user/updateUserExamCertified', Boolean(examCertified))
      this.$store.commit('user/updateSitterIntroVerified', Boolean(sitterIntroVerified))
      this.$store.commit('user/updateUserAccessState')
      this.$store.commit('user/updateUserCurrentMobileTab', 'services.explore')
      // updateUserAccessState is what will change the navbar
      this.$store.commit('user/updateUserNavbarVisibilityState', this.$store.getters['user/getNavbarVisibility'])

      this.sendImpression('Login Succesfully', 'Login track')
      /**
       * If user comes from ReferralSignup page, we would automatically
       * redirect them to ReferralsWelcome page
       */
      if (this.$q.localStorage.getItem('globalStorageReferralUserInfo')) {
        if (this.$store.state.user.backUrl) {
          let backUrl = this.$store.state.user.backUrl
          this.$router.replace(backUrl)
          this.$store.commit('user/updateUserBackUrlState', null)
        } else {
          this.$router.replace({name: 'ReferralsWelcome'})
        }
        return
      }

      /**
       * If user comes from Campaign page (ready for payment), we would automatically
       * redirect them to paypal payment page
       */
      if (this.$q.cookies.has('strayDogDonation') && this.$q.cookies.has('donationType')) {
        let userCurrency = this.$q.cookies.get('strayDogDonation').split(' ')[0]
        let userAmount = this.$q.cookies.get('strayDogDonation').split(' ')[1]

        if (this.$q.cookies.get('donationType') === 'BankTransfer') {
          this.$router.replace({name: 'CampaignsBankTransfer'})
        } else if (this.$q.cookies.get('donationType') === 'Paypal') {
          this._processDonationRequest(userCurrency, userAmount)
        }

        return
      }

      /**
       * If user comes from Premium Care Package Subscription page (ready for payment), we would automatically
       * redirect them to payment page
       */
      if (this.$q.cookies.has('premiumCarePackage') && this.$q.cookies.has('paymentType')) {
        if (this.$q.cookies.get('paymentType') === 'Boost') {
          let paymentInfo = this.$q.cookies.get('premiumCarePackage').split(':')
          this._processBoostPayment(paymentInfo[1], paymentInfo[2], paymentInfo[3], paymentInfo[0])
        } else if (this.$q.cookies.get('paymentType') === 'Paypal') {
          let paymentInfo = this.$q.cookies.get('premiumCarePackage').split(':')
          this._processSubscriptionRequest(paymentInfo[1], paymentInfo[2], paymentInfo[3], paymentInfo[0], paymentInfo[4])
        }

        return
      }

      /**
       * If user comes from Review page, we would automatically
       * redirect them to Review page
       * ----------------------------
       * New user with no verify email (fb login) either directly go into review or ask for email
       */
      if (this.$q.cookies.get('globalStorageReviewInfoUrl')) {
        this.$router.replace(this.$q.cookies.get('globalStorageReviewInfoUrl'))
        return
      } else if (!this.$store.getters['user/getUserEmail']) {
        // User still hasn't save email
        this.$router.replace({name: 'ConfirmEmail'})
        return
      }

      // If user still hasn't save phone number
      // if (!this.$store.getters['user/getUserMobileNum']) {
      //   this.$router.replace({name: 'PromptPhone'})
      //   return
      // }

      /**
       * If the user has a pet forms to submit, then we proceed to submit pet forms
       * and request forms, then redirect user to request page
       */
      if (this.$q.localStorage.has('localStoragePetInfo')) {
        let pets = this.$q.localStorage.getItem('localStoragePetInfo').petsInfo
        console.log('check the pets gettign from local storage', pets)
        this._processPetForm(pets)
        return
      }

      /**
       * When user is logging in, they might have come from the create request
       * page where the request page will ensure the user is logged in first
       * before creating a request. We need to check if the formRequest is
       * present, if it's not present then we redirect them back to the
       * last page they're in or to the default page which is request
       */
      if (this.$q.localStorage.has('localStorageRequestInfo')) {
        this._processFormRequest(
          this.$q.localStorage.getItem('localStorageRequestInfo'),
          preferredCurrency
        )
        return
      }

      /**
       * Proceed default redirection when all checking is done
       */
      this._processRedirect()
    },
    onFbSuccessLogin (userData) {
      console.log('UserInfo: ', userData)
      window.facebookConnectPlugin.getAccessToken((token) => {
        console.log('Token: ' + token)
        this.$router.replace({name: 'OAuthFacebook', hash: {access_token: token}})
      })
    },
    onAuthFacebook () {
      let appId = process.env.FB_APP_KEY
      let redirectUrl = window.location.origin + '/oauth/facebook/login'

      this.fbloading = true
      if (this.$q.platform.is.cordova) {
        window.facebookConnectPlugin.getLoginStatus(true, (response) => {
          console.log(response)
          if (response.status === 'connected') {
            // The user is logged in and has authenticated your
            // app, returns response.authResponse object
            let accessToken = response.authResponse.accessToken
            this.$router.replace({name: 'OAuthFacebook', hash: {access_token: accessToken}})
          } else if (response.status === 'not_authorized') {
            // The user hasn't authorized your application.
            window.facebookConnectPlugin.login(['public_profile', 'email'], (userData) => {
              this.onFbSuccessLogin(userData)
            }, (error) => {
              console.error(error)
              this.fbloading = false
            })
          } else {
            // The user isn't logged in to Facebook.
            window.facebookConnectPlugin.login(['public_profile', 'email'], (userData) => {
              this.onFbSuccessLogin(userData)
            }, (error) => {
              console.error(error)
              this.fbloading = false
            })
          }
        }, (error) => {
          this.fbloading = false
          console.error(error)
        })
      } else {
        this.openUrl(`https://www.facebook.com/v7.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUrl}&response_type=token`)
      }

      this.sendImpression('Login', 'FB')
    },
    loadGoogleOAuth () {
      // Ensure we load google oauth just once
      if (window.gapi && typeof window.gapi.auth2 === 'object') {
        return
      }

      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: process.env.GOOGLE_AUTH2_CLIENT_ID,
          scope: 'profile email',
          ux_mode: 'popup'
        })

        let vm = this
        let googleAuth = window.gapi.auth2.getAuthInstance()
        googleAuth.signIn().then((response) => {
          let user = window.gapi.auth2.getAuthInstance().currentUser.get()
          vm.processGoogleAuth(user.getBasicProfile())
        }).catch((e) => {
          console.error(e)
          let error = vm.$t('google.login.error')
          this.$q.notify({
            message: error
          })
          this.googleLoading = false
        })
      })
    },
    onAuthGoogle () {
      this.googleLoading = true
      if (!this.$q.platform.is.cordova) {
        if (typeof window.gapi.auth2 === 'undefined') {
          this.loadGoogleOAuth()
          this.$q.notify({
            message: 'It seems there is an error in processing login through google. Please try again later or proceed with login by email',
            type: 'negative'
          })
          this.googleLoading = false
        }
      } else {
        console.log('check  plugins', window.plugins)
        console.log('check google plugin', window.plugins.googleplus)
        window.plugins.googleplus.login({
          'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': process.env.GOOGLE_AUTH2_CLIENT_ID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        }, (obj) => {
          this.processGoogleAuth(obj)
        }, (msg) => {
          if (msg !== 'The user canceled the sign-in flow.') {
            if (msg === 7) {
              alert('No internet connection')
            } else {
              this.$emit('show-dialog')
              console.log('emit started')
              /*  alert('Google login was unsuccessful, Try Again') */
            }
          }
          this.googleLoading = false
        })
      }
    },
    processGoogleAuth (userObject) {
      let pushID = this.$store.state.user.pushid || '444444'
      let accountInfo = {
        'accountInfo': {
          'email': userObject.email ? userObject.email : '',
          'gpId': userObject.userId,
          'gpName': userObject.displayName,
          'gpEmail': userObject.email ? userObject.email : '',
          'gpLink': 'https://plus.google.com/' + userObject.userId,
          'gpAvatar': userObject.imageUrl,
          'mobileCountryId': this.mobileCountryId,
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
      }

      this.$axios.post(`account/logingplus?lang=${this.langToAPI(this.$store.state.user.language)}`, accountInfo).then((response) => {
        if (response.status === 200) {
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
        }
      }).catch(error => {
        console.error(error)
        /* let errorMessage = error.response.data.message || this.$t('google.login.error') */
        this.$q.notify({
          message: 'PLease try again',
          type: 'negative'
        })
      }).finally(_ => {
        this.googleLoading = false
      })
    },
    onAuthAppleLogin () {
      this.appleLoading = true
      if (this.$q.platform.is.cordova) {
        window.cordova.plugins.SignInWithApple.signin({
          // 0 - Full Name
          // 1 - Email
          requestedScopes: [0, 1]
        }, (obj) => {
          console.log(obj)
          this.processAppleAuth(obj)
        }, (error) => {
          console.error(error)
          if (error.code !== '1001' && error.code !== '1003') {
            alert(error.localizedDescription)
          }
          this.appleLoading = false
        })
      }
    },
    processAppleAuth (userObject) {
      let pushID = this.$store.state.user.pushid || '444444'

      // cache user email
      let userEmail = userObject.email
      if (userObject.email) {
        this.$store.commit('user/updateUserEmailState', userObject.email)
        this.$store.dispatch('user/update')
      } else {
        userEmail = this.$store.getters['user/getUserEmail']
      }

      let accountInfo = {
        'accountInfo': {
          'email': userEmail || '',
          'appleId': userObject.user,
          'username': `${userObject.fullName.givenName} ${userObject.fullName.familyName}`,
          'mobileCountryId': this.mobileCountryId,
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
      }

      this.$axios.post(`account/loginapple?lang=${this.langToAPI(this.$store.state.user.language)}`, accountInfo).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
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
        }
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative',
            position: 'top'
          })
        }
      }).finally(_ => {
        this.appleLoading = false
      })
    },
    getCountryShortName (id) {
      let myArray = countryLists
      for (let i = 0; i < myArray.length; i++) {
        if (parseInt(myArray[i].id) === parseInt(id)) {
          return myArray[i].shortName
        }
      }
      return null
    },
    createFormConversion (petDetails) {
      console.log('check the petdetails in coversion', petDetails)
      let form = createPetForm[this.$store.state.user.language]

      // fall back to en
      if (!form) {
        form = createPetForm['en']
      }
      form = JSON.parse(form.masterForm.replace('\\', '')).question

      for (var index in form) {
        console.log('check the pet detaais', petDetails)
        if (form[index].questionId === 2) {
          if (petDetails != null) {
            form[index].reply = petDetails.name
          } else {
            form[index].reply = 'Anonymous'
          }
        } else if (form[index].questionId === 4) {
          if (petDetails != null) {
            form[index].reply = petDetails.type
          } else {
            form[index].reply = 'Anonymous'
          }
        } else if (form[index].questionId === 6) {
          if (petDetails != null) {
            form[index].reply = petDetails.breed
          } else {
            form[index].reply = 'Anonymous'
          }
        } else if (form[index].questionId === 8) {
          if (petDetails != null) {
            form[index].reply = petDetails.name
          } else {
            form[index].reply = 'Anonymous'
          }
        } else if (form[index].questionId === 10) {
          // default set pet gender as others
          form[index].reply = 'Others'
        }
      }

      return {
        'question': form
      }
    }
  }
}

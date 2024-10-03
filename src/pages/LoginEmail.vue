<template>
  <q-page class="justify-center" style="min-height: 100%;height: 100%;">
    <div class="col-12 text-center text-label">
      <template v-if="reviewListingInfo !== null && (globalReviewStatus === false)">
        <img :src="reviewListingInfo.avatar" style="height: 100px; width: 100px;" alt="" class="responsive avatar">
        <h5 class="q-mt-none q-mb-sm q-pt-lg">{{ $t('login.leave.review.for', {sitterName: reviewListingInfo.biz_title}) }}</h5>
        <span class='text-bold small-size'>{{ $t('for.safety.purposes') }}</span>
      </template>
      <template v-else>
        <q-img ref="header-image" src="statics/images/login/login-screen-v1.jpg" :class="$q.platform.is.cordova ? 'fixed-top' : ''" class="image-upload" style="height: 320px;" basic>
          <q-icon name="chevron_left" style="left: -43%; top: 50px;" size="3em" color="white" @click="$router.go(-1)"></q-icon>
          <p style="position: absolute; right: 16px;top: 45px;" class="text-white text-weight-bold" @click="triggerReferralModal(true)">
            <span v-if="$store.getters['user/getUserReferrerCode']">{{$store.getters['user/getUserReferrerCode']}}</span>
            <span v-else>{{$t('add.referral.code')}}</span>
          </p>
        </q-img>

        <div class="text-center q-pa-md text-h4" v-if="$q.platform.is.browser">{{ $t("login.to.continue") }}</div>
      </template>

      <!-- Dialog Referral Code -->
      <dialog-add-referral :trigger="referralModal" @on-close="triggerReferralModal"></dialog-add-referral>

      <div class="bg-white" ref="container" style="position: absolute; height: 100vh;padding-top: 40px;width: 100vw;">
        <!-- Pop Up on Login Status -->
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
          <q-banner rounded v-if="serverErrorMessage" class="text-white bg-negative q-mx-lg q-pa-xs" style="border-radius: 8px;" @click="() => { serverErrorMessage = null }">
            <span class="text-subtitle1">{{ serverErrorMessage }}</span>
          </q-banner>
        </transition>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
          <q-banner rounded v-if="userNotFound" class="text-white bg-negative q-mx-lg q-pa-xs" style="border-radius: 8px;" @click="() => { userNotFound = null }" >
            <span class="text-subtitle1">{{ userNotFound }}</span>
            <q-btn color="primary q-ml-sm" @click="toSignUpPage">{{ $t('signup') }}</q-btn>
          </q-banner>
        </transition>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
          <q-banner rounded v-if="forgetPasswordAlert" class="text-white bg-positive q-mx-lg q-pa-xs" style="border-radius: 8px;" @click="() => { forgetPasswordAlert = null }" >
            <span class="text-subtitle1">{{ forgetPasswordAlert }}</span>
          </q-banner>
        </transition>

        <form v-on:submit.prevent="submitLogin" autocomplete="on" class="q-px-md q-mx-sm">
          <div class="q-my-sm">
            <q-input type="email" data-cy="login-email" autocomplete="email" borderless class="input bg-white" hide-bottom-space :error="(!$v.form.email.required || !$v.form.email.email) && displayError" :label="$t('email')" v-model="form.email" @keyup.enter="$refs.inputPassword.focus()"/>
            <small class="text-red-14" v-if="!$v.form.email.required && displayError"> {{ $t('vuelidate.please.enter.email') }} </small>
            <small class="text-red-14" v-if="!$v.form.email.email && displayError"> {{ $t('vuelidate.email.invalid') }} </small>
          </div>
          <div class="q-my-sm">
            <q-input :type="isPwd ? 'password' : 'text'" data-cy="login-password" autocomplete="current-password" borderless class="input bg-white" hide-bottom-space ref="inputPassword" :label="$t('password')" v-model="form.password" :error="!$v.form.password.required && displayError" @keyup.enter="submitLogin">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                ></q-icon>
              </template>
            </q-input>
            <small class="text-red-14" v-if="!$v.form.password.required && displayError">{{ $t('vuelidate.please.enter.password') }}</small>
          </div>
        </form>

        <div class="q-px-md bg-white">
          <!-- Login Buttons -->
          <div class="q-my-md q-mx-sm">
            <q-btn no-caps :loading="loginLoading" :disabled="loginLoading" data-cy="login-submit"  style="border-radius: 6px;" class="full-width font-title" color="primary" :label="$t('login.with.email')" @click.native="submitLogin"/>
          </div>
          <div class="full-width text-right">
            <span class="anchor-link" @click="$emit('update-email', form.email),$router.push('/forgot-password')">{{ $t("forgot.your.password") }} </span>
          </div>
          <div :class="$q.platform.is.browser ? 'text-middle-line' : 'q-mt-lg'">
            <span class="lowercase text-label">{{ $t('or') }} {{ $t('continue.with') }}</span>
          </div>

          <!-- Other login options -->
          <div v-if="$q.platform.is.cordova" class="bg-white">
              <q-btn class="q-my-sm q-mx-sm" no-caps round :loading="fbloading" :disabled="fbloading" style="background: #4568b2;" @click="sendImpression('Login', 'FaceBook');onAuthFacebook()">
                <q-icon name="fab fa-facebook-f" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
              <q-btn class="q-my-sm q-mx-sm" :loading="googleLoading" :disable="googleLoading"  no-caps round @click="sendImpression('Login', 'G+');onAuthGoogle()">
                <q-icon name="img:statics/images/google_logo.png" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
              <q-btn v-if="$q.platform.is.ios" :loading="appleLoading" class="q-my-sm q-mx-sm" round style="background: black;" @click="sendImpression('Login', 'Apple');onAuthAppleLogin()">
                <q-icon name="fab fa-apple" style="color: white; height: 45px; width: 45px;"/>
              </q-btn>
          </div>
          <div v-else>
            <q-btn no-caps class="full-width q-mb-sm" size="lg" outline :loading="fbloading" @click.native="onAuthFacebook()">
              <q-icon name="fab fa-facebook-f" class="facebook-color"  style="height: 45px; width: 45px;"/>
              {{ $t('login.with.facebook') }}
            </q-btn>
            <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disable="googleLoading" @click.native="sendImpression('Login', 'G+');onAuthGoogle()">
              <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
              {{ $t('google') }}
            </q-btn>
          </div>

          <div :class="$q.platform.is.browser ? 'text-middle-line' : ''"></div>
          <h6 class="full-width text-center q-my-none text-weight-regular font-normal bg-white" v-if="$q.platform.is.cordova">
            {{ $t('dont.have.an.account') }} <span class="anchor-link" @click="$router.push({name: 'SignupEmail', query: $route.query})">{{ $t("signup") }} </span>
          </h6>
          <h6 class="full-width text-center q-my-none text-weight-regular font-normal bg-white" v-else>
            {{ $t('dont.have.an.account') }} <span class="anchor-link" @click="$router.push({name: 'Signup', query: $route.query})">{{ $t("signup") }} </span>
          </h6>

          <div v-html="$t('signup.email.msg')" style="border: solid 1px lightgrey;border-radius: 10px;margin-top: 29%;" class="q-pa-sm bg-white"></div>
        </div>
      </div>
    </div>
    <google-error :trigger="trigger" @google-close="handleGoogleClose"></google-error>
  </q-page>
</template>

<script>
/* global bugsnagClient */
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import authFlowMixin from '../mixins/authFlowMixin'
import languages from 'assets/languages.json'

export default {
  mixins: [validationMixin, authFlowMixin],
  components: {
    'dialog-add-referral': () => import('components/DialogAddReferralCode.vue'),
    'google-error': () => import('../components/ComponentGoogleError.vue')
  },
  props: {
    updatedEmail: null
  },

  computed: {
    trigger () {
      return this.showDialog
    }
  },
  data () {
    return {
      form: {
        email: this.updatedEmail || null,
        password: null
      },
      isPwd: true,
      referralModal: false,
      displayError: false,
      formRequest: this.$q.localStorage.getItem('localStorageRequestInfo') || null,
      serverErrorMessage: null,
      mobileCountryId: this.$store.getters['user/getUserMobileCountryId'],
      loginLoading: false,
      userNotFound: false,
      forgetPasswordAlert: this.$q.localStorage.getItem('forgetPasswordAlert') || false,
      reviewListingInfo: this.$q.cookies.get('globalStorageReviewListingInfo') || null,
      globalReviewStatus: !this.$q.cookies.get('globalReviewStatus') || true,
      showDialog: false
    }
  },
  beforeCreate () {
    if (this.$store.state.user.access === true) {
      if (this.$q.platform.is.mobile) {
        this.$router.replace({name: 'MobileDashboard'})
      } else {
        this.$router.replace({name: 'Requests'})
      }
    }
  },
  mounted () {
    this.$refs['container'].style.top = `${this.$refs['header-image'].$el.clientHeight}px`
    this.$store.commit('user/updateUserReviewState', false)
    this.$q.localStorage.remove('forgetPasswordAlert')
    this.sendImpression('Login', 'Email')
    this.$on('show-dialog', () => {
      console.log('Emitting for google')
      this.showDialog = true
      console.log(this.showDialog)
    })
  },
  methods: {
    triggerReferralModal (status) {
      this.referralModal = status
    },
    handleGoogleClose () {
      console.log('Google Error dialog closed')
      this.showDialog = false
    },
    toSignUpPage () {
      this.$q.localStorage.set('loginEmail', this.form.email)
      this.$q.localStorage.set('loginPassword', this.form.password)
      this.$router.push({path: '/signup/email', query: this.$route.query})
    },
    submitLogin: function () {
      this.serverErrorMessage = null
      this.userNotFound = null
      this.loginLoading = true
      if (!this.form.email) {
        this.displayError = true
        this.loginLoading = false
        return
      } else {
        this.form.email = this.form.email.replace(/ /g, '')
        this.form.email = this.form.email.replace(/。/g, '.')
        this.form.email = this.form.email.replace(/·/g, '.')
      }

      /**
       * These 2 line will display all the neccesary error
       * on the form when user click submit button
       */
      this.displayError = !this.displayError
      this.$v.form.$touch()

      /**
       * Disable the form to be submitted if the user
       * has not completed the form
       */
      if (this.$v.form.$error) {
        this.displayError = true
        this.loginLoading = false
        return null
      }

      let langId = this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id
      if (this.$route.query.lang) {
        langId = this.$_.findWhere(languages, {'value': this.$route.query.lang}).id
      }

      let pushID = this.$store.state.user.pushid || '444444'
      let accountInfo = JSON.stringify({
        'accountInfo': {
          'email': this.form.email,
          'password': this.form.password,
          'pushId': pushID,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'language': langId,
          'appVersion': process.env.APP_VERSION,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      })
      this.$axios.post(`account/loginemail`, accountInfo, {
        headers: {
          DeviceId: this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      }).then((response) => {
        this.$q.localStorage.set('globalStorageAccountInfo', response.data)
        if (response.status === 200) {
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
      }).catch(e => {
        console.error(e)

        let errorMessage = this.$t('login.fail')
        // Offer user to signup if there is no account for that credentials
        if (e.response.data.name && e.response.data.name === 'Not Found') {
          this.userNotFound = this.$t('you.do.not.have.account')
          //  this.$q.localStorage.set('loginEmail', this.form.email)
          //  this.$q.localStorage.set('loginPassword', this.form.password)
          return
        } else if (e.message) {
          console.error(e.message)
          errorMessage = e.message
        }

        if (e.response.data && e.response.data.message) {
          errorMessage = e.response.data.message
          let lang = this.$store.getters['user/getCurrentLanguage']
          bugsnagClient.notify(new Error(errorMessage), {
            beforeSend: function (report) {
              report.metaData = {
                accountInfo: {
                  language: lang
                }
              }
            }
          })
        }
        this.serverErrorMessage = errorMessage
      }).finally(_ => {
        this.loginLoading = false
      })
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-pa-md
  padding: 15px 0px

div.text-middle-line
  width: 100%
  text-align: center
  border-bottom: 1px solid #c7c7c7
  line-height: 0.1em
  margin: 15px 0px

.text-middle-line span
  background:#fff
  padding:0 10px

.small-size
  font-size 14px
</style>

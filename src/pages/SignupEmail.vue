<template>
  <q-page class="justify-center" style="min-height: 100%;height: 100%;">
    <div class="col-12 text-center text-grey-14" style="min-width: 500px;">
      <template v-if="reviewListingInfo !== null && (globalReviewStatus !== true)">
        <img :src="reviewListingInfo.avatar" style="height: 100px; width: 100px;" alt="" class="responsive avatar">
        <h5 class="q-mt-none q-mb-sm q-pt-lg">{{ $t('signup.leave.review.for', {sitterName: reviewListingInfo.biz_title}) }}</h5>
        <span class='text-bold small-size'>{{ $t('for.safety.purposes') }}</span>
      </template>
      <template v-else>
        <q-img src="statics/images/login/login-screen-v1.jpg" class="image-upload" :class="$q.platform.is.cordova ? 'fixed-top' : ''" style="height: 320px;" basic>
          <q-icon name="chevron_left" style="left: -43%; top: 50px;" size="3em" color="white" @click="$router.go(-1)"></q-icon>
          <p style="position: absolute; right: 16px;top: 45px;" class="text-white text-weight-bold" @click="triggerReferralModal(true)">
            <span v-if="$store.getters['user/getUserReferrerCode']">{{$store.getters['user/getUserReferrerCode']}}</span>
            <span v-else>{{$t('add.referral.code')}}</span>
          </p>
        </q-img>

        <div class="text-center q-pa-md text-h4" v-if="$q.platform.is.browser">{{ $t("signup.to.continue") }}</div>
      </template>

      <!-- Dialog Referral Code -->
      <dialog-add-referral :trigger="referralModal" @on-close="triggerReferralModal"></dialog-add-referral>

      <div class="bg-white" style="position: absolute; top: 31vh; width: 100vw;height: 100vh;padding-top: 40px;">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear>
          <q-banner rounded v-if="serverErrorMessage" class="text-white bg-negative q-mx-lg q-pa-xs" style="border-radius: 8px;" @click="() => { serverErrorMessage = null }" >
            <span class="text-subtitle1">{{serverErrorMessage }}</span>
          </q-banner>
        </transition>

        <div class="q-px-md bg-white">
          <!-- Sign Up Form -->
          <q-input type="email" class="q-mx-xs text-left q-my-sm capitalize input bg-white" autocomplete="email" borderless hide-bottom-space :error="$v.form.$error && (!$v.form.email.required || !$v.form.email.email)" :label="$t('email')" v-model="form.email" ref="inputEmail" @keyup.enter="$refs.reEnterEmail.focus()" autofocus/>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.email.required && displayError"> {{ $t('vuelidate.please.enter.email') }} </div>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.email.email && displayError"> {{ $t('vuelidate.email.invalid') }} </div>

          <q-input type="email" class="q-mx-xs text-left q-my-sm input bg-white" autocomplete="email" borderless hide-bottom-space :error="$v.form.$error && (!$v.form.email.required || !$v.form.repeatEmail.sameAsEmail)" :label="$t('re.enter.email')" ref="reEnterEmail" v-model="form.repeatEmail" @keyup.enter="$refs.inputPassword.focus()"/>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.email.required && displayError">{{ $t('vuelidate.repeat.email.empty') }}</div>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.repeatEmail.sameAsEmail && displayError">{{ $t('vuelidate.repeat.email.same') }}</div>

          <q-input class="q-mx-xs text-left q-my-sm input bg-white" autocomplete="username" borderless hide-bottom-space :label="$t('username')" v-model="form.username" :error="$v.form.$error && !$v.form.username.required " ref="inputPassword" @keyup.enter="$refs.inputRePassword.focus()"/>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.username.required && displayError">{{ $t('vuelidate.please.enter.username') }}</div>

          <q-input :type="isPwd ? 'password' : 'text'" class="q-mx-xs text-left q-my-sm input bg-white" autocomplete="new-password" borderless hide-bottom-space :label="$t('password')" v-model="form.password" :error="$v.form.$error && !$v.form.password.required" ref="inputRePassword" @keyup.enter="submitSignup">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              ></q-icon>
            </template>
          </q-input>
          <div class="text-negative text-left text-weight-light" v-if="!$v.form.password.required && displayError">{{ $t('vuelidate.please.enter.password') }}</div>

          <!-- Sign Up Button -->
          <q-btn :loading="signupLoading" :disabled="signupLoading || !form.email || !form.repeatEmail || !form.username || !form.password" no-caps style="border-radius: 6px;" class="q-mx-xs full-width font-title q-mt-md" color="primary" :label="$t('signup')" @click="submitSignup" />
          <div :class="$q.platform.is.browser ? 'text-middle-line' : 'q-mt-md'">
            <span class="lowercase text-label">{{ $t('or') }} {{ $t('continue.with') }}</span>
          </div>

          <!-- Other signup options -->
          <div v-if="$q.platform.is.cordova">
            <q-btn class="q-my-sm q-mx-sm" no-caps round :loading="fbloading" :disable="fbloading" style="background: #4568b2;" @click="sendImpression('Login', 'FaceBook');onAuthFacebook()">
              <q-icon name="fab fa-facebook-f" style="color: white; height: 45px; width: 45px;"/>
            </q-btn>
            <q-btn class="q-my-sm q-mx-sm" no-caps round :loading="googleLoading" :disable="googleLoading"  @click="sendImpression('Login', 'G+');onAuthGoogle()">
              <q-icon name="img:statics/images/google_logo.png" style="color: white; height: 45px; width: 45px;"/>
            </q-btn>
            <q-btn v-if="$q.platform.is.ios" :loading="appleLoading" class="q-my-sm q-mx-sm" round style="background: black;" @click="sendImpression('Login', 'Apple');onAuthAppleLogin()">
              <q-icon name="fab fa-apple" style="color: white; height: 45px; width: 45px;"/>
            </q-btn>
          </div>
          <div v-else>
            <q-btn no-caps class="full-width q-mb-sm" size="lg" outline :loading="fbloading" @click.native="sendImpression('Signup', 'FB'), onAuthFacebook()">
              <q-icon name="fab fa-facebook-f" class="facebook-color" style="height: 45px; width: 45px;"/>
              {{ $t('login.with.facebook') }}
            </q-btn>
            <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disable="googleLoading" @click.native="sendImpression('Signup', 'G+'), onAuthGoogle()">
              <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
              {{ $t('google') }}
            </q-btn>
          </div>

          <!-- Already have account , login now -->
          <div :class="$q.platform.is.browser ? 'text-middle-line' : ''"></div>
          <h6 class="full-width text-center q-my-none text-weight-regular font-normal" v-if="$q.platform.is.cordova">
            {{ $t('already.have.account') }} <span class="anchor-link" @click="$router.push({name: 'LoginEmail', query: $route.query})">{{ $t("login") }} </span>
          </h6>
          <h6 class="full-width text-center q-my-none text-weight-regular font-normal" v-else>
            {{ $t('already.have.account') }} <span class="anchor-link" @click="$router.push({name: 'Index', query: $route.query})">{{ $t("signup") }} </span>
          </h6>

          <!-- Terms -->
          <div v-html="$t('signup.email.msg')" style="border: solid 1px lightgrey;border-radius: 10px;margin-top: 14%;" class="q-pa-sm"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
/* global bugsnagClient */
import { validationMixin } from 'vuelidate'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import authFlowMixin from '../mixins/authFlowMixin.js'
import languages from 'assets/languages.json'

export default {
  mixins: [validationMixin, authFlowMixin],
  components: {
    'dialog-add-referral': () => import('components/DialogAddReferralCode.vue')
  },
  data () {
    return {
      referralModal: false,
      form: {
        email: this.$q.localStorage.getItem('loginEmail') || null,
        repeatEmail: null,
        password: this.$q.localStorage.getItem('loginPassword') || null,
        repeatPassword: null
      },
      displayError: false,
      formRequest: this.$q.localStorage.getItem('localStorageRequestInfo') || null,
      serverErrorMessage: null,
      isPwd: true,
      signupLoading: false,
      accountInfo: {
        username: null,
        email: null,
        password: null,
        mobileCountryId: this.$store.getters['user/getUserMobileCountryId'],
        mobileNum: '',
        pushId: this.$store.state.user.pushid || '444444',
        vendor: 5,
        osVersion: null,
        platform: 'WEB',
        model: null,
        screenWidth: screen.width,
        screenHeight: screen.height,
        language: 1,
        appVersion: process.env.APP_VERSION,
        referrer: this.$store.getters['user/getUserReferrerCode'],
        deviceId: this.$q.cookies.get('device-uuid')
      },
      reviewListingInfo: this.$q.cookies.get('globalStorageReviewListingInfo') || null,
      globalReviewStatus: this.$q.cookies.get('globalReviewStatus') || null
    }
  },
  preFetch ({store, redirect}) {
    if (store.state.user.access) {
      redirect('/dashboard')
    }
  },
  created () {
    // Clear the localStorage for this 2
    setTimeout(() => {
      this.$q.localStorage.remove('loginEmail')
      this.$q.localStorage.remove('loginPassword')
    }, 3000)
  },
  mounted () {
    if (this.$refs.inputEmail) {
      this.$refs.inputEmail.focus()
    }
    this.sendImpression('Signup', 'Email')
  },
  beforeDestroy () {
    // ensure email and password are clear
    this.$q.localStorage.remove('loginEmail')
    this.$q.localStorage.remove('loginPassword')
  },
  watch: {
    langChange (newValue, oldValue) {
      this.accountInfo.language = this.$_.findWhere(languages, {'value': newValue}).id || 1
    }
  },
  computed: {
    langChange () {
      return this.$store.state.user.language
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      username: {
        required
      },
      password: {
        required
      },
      repeatEmail: {
        sameAsEmail: sameAs('email')
      }
    }
  },
  methods: {
    triggerReferralModal (status) {
      this.referralModal = status
    },
    submitSignup () {
      let vm = this
      vm.signupLoading = !vm.signupLoading

      if (vm.form.email) {
        vm.form.email = vm.form.email.replace(/ /g, '')
        vm.form.email = vm.form.email.replace(/。/g, '.')
        vm.form.email = vm.form.email.replace(/·/g, '.')
      }

      if (vm.form.repeatEmail) {
        vm.form.repeatEmail = vm.form.repeatEmail.replace(/ /g, '')
        vm.form.repeatEmail = vm.form.repeatEmail.replace(/。/g, '.')
        vm.form.repeatEmail = vm.form.repeatEmail.replace(/·/g, '.')
      }

      vm.displayError = !vm.displayError
      vm.$v.form.$touch()

      /**
       * Disable the form to be submitted if the user
       * has not completed the form
       */
      if (vm.$v.form.$error) {
        vm.signupLoading = !vm.signupLoading
        vm.displayError = true
        return null
      }

      vm.accountInfo.email = vm.form.email
      vm.accountInfo.password = vm.form.password
      vm.accountInfo.username = vm.form.username
      vm.accountInfo.referrer = vm.$store.getters['user/getUserReferrerCode']
      vm.accountInfo.language = this.$_.findWhere(languages, {'value': this.$store.state.user.language}).id
      let accountInfo = JSON.stringify({
        'accountInfo': vm.accountInfo
      })

      vm.$q.localStorage.set('globalStorageSignupAccountInfo', accountInfo)

      // If we don't have cached request, then user will go to the verification page
      /*  if (!vm.$q.localStorage.getItem('localStorageRequestInfo')) {
        vm.$router.push('/user/verification')
      } */

      vm.signupLoading = true
      if (typeof accountInfo !== 'string') {
        vm.$q.notify({
          message: vm.$t('register.error'),
          type: 'negative'
        })

        let lang = this.$store.getters['user/getCurrentLanguage']
        bugsnagClient.notify(new Error('Account Info is empty when trying to register new user with accountInfo' + JSON.stringify(accountInfo)), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang
              }
            }
          }
        })

        this.$router.replace('/')
        return
      }

      /**
       * Remove the accountInfo session to prevent from submitting again
       * in case user decided to reload the page
       */
      this.$q.localStorage.remove('globalStorageSignupAccountInfo')
      this.$axios.post(`/account?lang=${this.langToAPI(this.$store.state.user.language)}`, accountInfo)
        .then((response) => {
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
        })
        .catch(e => {
          vm.signupLoading = !vm.signupLoading
          this.forceLogout(e)
          console.log(e)
          let lang = this.$store.getters['user/getCurrentLanguage']
          bugsnagClient.notify(new Error(e), {
            beforeSend: function (report) {
              report.metaData = {
                accountInfo: {
                  language: lang
                }
              }
            }
          })

          let errorMessage = this.$t('signup.fail')
          if (e.response.data && e.response.data.message) {
            this.serverErrorMessage = e.response.data.message
            setTimeout(() => {
              this.serverErrorMessage = null
            }, 5500)
          } else {
            this.$q.notify({
              message: errorMessage,
              type: 'negative'
            })
            setTimeout(() => {
              vm.$router.replace('/')
            }, 2000)
          }
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
div.text-middle-line
  width: 100%
  text-align: center
  border-bottom: 1px solid #c7c7c7
  line-height: 0.1em
  margin: 15px 0px
  color: #8e8e8e

.text-middle-line span
  background:#fff
  padding:0 10px
</style>

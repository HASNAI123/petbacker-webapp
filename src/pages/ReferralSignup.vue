<template>
  <q-page class="row justify-center" style="min-height: 100%;max-height: 100%;overflow-x: hidden;" padding>
    <img src="statics/images/referral_back_petbacker.jpg" class="back-img absolute-top" alt="" style="z-index: 1; min-height: 350px;">
    <div v-if="!$store.state.user.access" class="col-lg-5 col-sm-6 col-xs-12 q-mt-xl q-pa-md text-center max-width" style="z-index: 20;">
      <div class="row full-width" v-if="userInfo">
        <img class="avatar-img margin-auto" :src="userInfo.avatarImage" />
        <h4 class="q-my-sm text-white full-width referral-title" v-if="parseInt($route.query.sitter) === 1">{{ userInfo.username }} has invited you to join!</h4>
        <h4 class="q-my-sm text-white full-width referral-title" v-else>{{ userInfo.username }} {{ $t('signup.referral.title1') }} {{ userInfo.referralAmount }}</h4>
      </div>
      <div class="row full-width" v-else>
        <q-skeleton class="avatar-img margin-auto" type="circle" size="100px"></q-skeleton>
        <q-skeleton class="q-my-sm text-white full-width referral-title"></q-skeleton>
      </div>

      <div class="row full-width bg-white text-center text-grey-14 q-pa-md" style="z-index: 20;">
        <p class="q-my-sm q-mb-lg" v-if="parseInt($route.query.sitter) === 1">Sign up as a Pet Care Service Provider and make money doing what you love!</p>
        <p class="q-my-sm" v-else>{{ $t('signup.referral.title2') }}</p>

        <div v-if="parseInt($route.query.sitter) === 0" class="margin-auto">
          <p class="full-width q-my-lg" v-if="userInfo">{{ $t('signup.referral.title3') }} {{ userInfo.referralAmount }} {{ $t('signup.referral.title4') }}</p>
          <q-skeleton v-else class="q-my-lg" width="250px"></q-skeleton>
        </div>

        <q-btn class="full-width q-mb-sm" no-caps size="lg" color="primary" icon="fab fa-facebook-f" :label="$t('login.with.facebook')" :loading="fbloading" @click.native="sendImpression('Sign Up - Referral', 'FB');onAuthFacebook()" style="background: #4568b2 !important;" />
        <div class="text-middle-line">
          <span class="lowercase">{{ $t('or') }} {{ $t('signup.with') }}</span>
        </div>
        <q-btn no-caps class="full-width q-mb-sm q-mt-md" color="primary" outline icon="mail" size="lg" :label="$t('email')" @click.native="sendImpression('Sign Up - Referral', 'Email');$router.push('/signup/email')"/>
        <q-btn no-caps class="full-width q-my-sm" :label="$t('google')" icon="img:statics/images/google_logo.png" size="lg" outline :loading="googleLoading" :disabled="googleLoading" @click.native="sendImpression('Sign Up - Referral', 'G+');onAuthGoogle()"></q-btn>
        <q-btn no-caps class="full-width q-my-sm" label="Apple" size="lg" icon="apple" outline :loading="googleLoading" :disabled="googleLoading" @click="sendImpression('Sign Up - Referral', 'Apple');onAuthAppleLogin()"></q-btn>
        <div class="text-middle-line"></div>
        <div v-html="$t('signup.email.msg')" class="q-pb-xl"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin'
import languageSwitcherMixin from '../mixins/languageSwitcherMixin'

export default {
  mixins: [authFlowMixin, languageSwitcherMixin],
  data () {
    return {
      referral: this.$route.query.code || this.$route.params.code,
      userInfo: null
    }
  },
  watch: {
    '$route': 'getReferral'
  },
  created () {
    this.$store.commit('user/updateUserReviewState', false)
    if (this.$store.state.user.access) {
      this.$router.replace({name: 'MobileDashboard'})
    }

    this.getReferral()
    console.log(this.$route)
  },
  mounted () {
    this.sendImpression('Sign Up - Referral', 'Impressions', this.referral)

    if (parseInt(this.$route.query.sitter) === 1) {
      let routeInfo = this.$router.resolve({name: 'MobileDashboard', query: {createListing: 1}})
      this.$store.commit('user/updateUserBackUrlState', routeInfo.location)
    }
  },
  methods: {
    getReferral () {
      if (!this.referral) {
        this.$router.replace({name: 'Index'})
        return
      }

      this.$axios.get('/users/referralcode/' + this.referral)
        .then((response) => {
          this.userInfo = response.data.userInfo
          this.$store.commit('user/updateUserReferrerState', this.referral)
          // used in ReferralsWelcome page
          this.$q.localStorage.set('globalStorageReferralUserInfo', this.userInfo)

          if (this.userInfo.language) {
            let language = this.userInfo.language.toString().toLowerCase().replace('-', '_').replace('_', '')
            if (this.languageAllowed(language)) {
              this.$i18n.locale = language
              this.$store.commit('user/updateUserLanguageState', language)
            } else {
              console.log(`Referral Signup: Language ${language} is not allowed`)
            }
          }
        }).catch(e => {
          console.log(e)
        }).finally(_ => {
          if (!this.userInfo) {
            this.$router.replace({name: 'Index'})
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

.avatar-img
  height: 114px;
  width: 114px;
  border-radius: 50%;
  border: 2px solid #fff;

.margin-auto
  margin-left: auto;
  margin-right: auto;

.back-img
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter:blur(10px);
  -o-filter:blur(10px);
  -ms-filter:blur(10px);
  -moz-filter:blur(10px);
  -webkit-filter:blur(10px);
  filter: saturate(200%) brightness(75%);
</style>

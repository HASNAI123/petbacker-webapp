<template>
  <q-page class="row justify-center" padding>
    <div v-if="!$store.state.user.access" class="col-12 text-center text-label">
      <!-- Review Sign Up -->
      <template v-if="reviewListingInfo !== null && globalReviewStatus !== true">
        <img :src="reviewListingInfo.avatar" style="height: 100px; width: 100px;" alt="" class="responsive avatar">
        <h5 class="q-mt-none q-mb-sm q-pt-lg">{{ $t('signup.leave.review.for', {sitterName: reviewListingInfo.biz_title}) }}</h5>
        <span class='text-bold small-size'>{{ $t('for.safety.purposes') }}</span>
        <q-btn class="full-width q-mb-sm q-mt-md" no-caps size="lg" outline :loading="fbloading" @click.native="sendImpression('Signup', 'FB'), onAuthFacebook()">
          <q-icon name="fab fa-facebook-f" class="facebook-color" style="height: 45px; width: 45px;"/>
          {{ $t('login.with.facebook') }}
        </q-btn>
        <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disabled="googleLoading" @click.native="sendImpression('Signup', 'G+'), onAuthGoogle()">
          <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
          {{ $t('google') }}
        </q-btn>
        <div class="text-middle-line">
          <span class="lowercase text-label">{{ $t('or') }} {{ $t('signup.with') }}</span>
        </div>
       <q-btn no-caps class="full-width q-mb-sm q-mt-sm" color="primary" icon="mail" size="lg" :label="$t('email')" @click.native="$router.push({path: 'signup/email', query: $route.query})"/>
      </template>
      <!-- Boostapia Sign Up -->
      <template v-else-if="boostSignup">
        <h4 class="q-mt-none q-mb-sm">{{ $t('signup.title') }}</h4>
        <q-btn class="full-width q-mb-sm q-mt-md" no-caps size="lg" outline :loading="fbloading" @click.native="sendImpression('Signup', 'FB'), onAuthFacebook()">
          <q-icon name="fab fa-facebook-f" class="facebook-color" style="height: 45px; width: 45px;"/>
          {{ $t('login.with.facebook') }}
        </q-btn>
        <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disabled="googleLoading" @click.native="sendImpression('Signup', 'G+'), onAuthGoogle()">
          <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
          {{ $t('google') }}
        </q-btn>
        <div class="text-middle-line">
          <span class="lowercase text-label ">{{ $t('or') }} {{ $t('signup.with') }}</span>
        </div>
       <q-btn no-caps class="full-width q-mb-sm q-mt-sm" color="primary" icon="mail" size="lg" :label="$t('email')" @click.native="$router.push({path: 'signup/email', query: $route.query})"/>
      </template>
      <!-- General Sign Up -->
      <template v-else>
        <h4 class="q-mt-none">{{ $t('signup.title') }}</h4>
        <q-btn no-caps class="full-width q-mb-sm q-mt-md" color="primary" icon="mail" size="lg" :label="$t('email')" @click.native="$router.push({path: 'signup/email', query: $route.query})"/>
        <div class="text-middle-line">
          <span class="lowercase text-label">{{ $t('or') }} {{ $t('signup.with') }}</span>
        </div>
        <q-btn class="full-width q-mb-sm" no-caps size="lg" outline :loading="fbloading" @click.native="sendImpression('Signup', 'FB'), onAuthFacebook()">
          <q-icon name="fab fa-facebook-f" class="facebook-color" style="height: 45px; width: 45px;"/>
          {{ $t('login.with.facebook') }}
        </q-btn>
        <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disabled="googleLoading" @click.native="sendImpression('Signup', 'G+'), onAuthGoogle()">
          <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
          {{ $t('google') }}
        </q-btn>
      </template>
      <div class="text-middle-line"></div>
      <h5 class="text-center text-label">
        {{ $t('already.have.account') }} <span class="anchor-link" @click="$router.push({path: '/login/email', query: $route.query})">{{ $t("login") }} </span>
      </h5>
      <div v-html="$t('signup.email.msg')" class="q-pb-xl"></div>
    </div>
  </q-page>
</template>

<script>
import authFlowMixin from '../mixins/authFlowMixin.js'
import countryLists from 'assets/countries.json'
import { Platform } from 'quasar'
export default {
  mixins: [authFlowMixin],
  data () {
    return {
      reviewListingInfo: null,
      globalReviewStatus: null,
      boostSignup: false,
      campaignSignup: false
    }
  },
  preFetch ({store, redirect}) {
    if (store.state.user.access) {
      if (Platform.is.mobile) {
        redirect('/dashboard')
      } else {
        redirect('/requests')
      }
    }
  },
  created () {
    if (this.$q.cookies.get('globalStorageReviewInfoUrl') === '/boostopia') {
      this.boostSignup = true
    } else if (this.$q.cookies.has('globalStorageReviewListingInfo')) {
      this.globalReviewStatus = this.$q.cookies.get('globalReviewStatus')
      this.reviewListingInfo = this.$q.cookies.get('globalStorageReviewListingInfo')
    } else if (this.$q.cookies.has('strayDogDonation')) {
      this.campaignSignup = true
    }

    if (this.$route.query.rc) {
      this.$store.commit('user/updateUserReferrerState', this.$route.query.rc)
    }

    // ensure user's mobile country id exist on sign up
    this.cacheUserMobileCountryId()
  },
  mounted () {
    this.sendImpression('Signup Selection')
  },
  methods: {
    cacheUserMobileCountryId () {
      let vm = this
      countryLists.find(function (country) {
        if (country.countryName === vm.$store.getters['geolocation/geopluginCountryCode']) {
          vm.$store.commit('user/updateUserMobileCountryIdState', parseInt(country.id), { root: true })
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
</style>

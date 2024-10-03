<template>
  <q-page v-if="!$store.state.user.access" class="justify-center" style="min-height: 100%;max-height: 100%;">
    <q-img src="statics/images/login/login-screen-v1.jpg" class="image-upload" basic style="height: 320px;"></q-img>
    <div class="col-12 text-center text-label q-px-md">
      <div v-if="$q.platform.is.cordova">
        <q-carousel v-model="loginSlider" style="height: 60px;max-heigth: 80px;" swipeable color="white" animated :autoplay="3500" infinite transition-prev="slide-right" transition-next="slide-left">
          <q-carousel-slide name="1">
            <div class="text-center">
              {{$t('index.carousel.create')}}
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="2">
            <div class="text-center">
              {{$t('index.carousel.provide')}}
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <div v-else>
        <h4 class="q-mt-none" v-if="!$q.localStorage.getItem('localStorageRequestInfo')">{{ $t('signup.welcome.title') }}. {{ $t('login.to.continue') }}</h4>
        <h4 class="q-mt-none" v-else>{{ $t('must.be.login.submit.request') }}</h4>
      </div>

      <!-- Login Options -->
      <div v-if="$q.platform.is.cordova" class="q-mt-lg">
        <q-btn no-caps class="full-width q-my-xs font-normal" color="primary" :label="$t('index.pet.owner')" @click="$router.push({name: 'LoginEmail', query: $route.query})" data-cy="login-owner-button"></q-btn>
        <q-btn no-caps class="full-width q-my-xs font-normal text-white" style="background: #c9b6ed;" :label="$t('index.sitters.services')" @click="$router.push({name: 'LoginEmail', query: $route.query})" data-cy="login-sitter-button"></q-btn>
        <q-btn no-caps class="full-width q-my-xs font-normal text-white" ref="exploreButton" style="background: #e9a189;" :loading="guestLoginLoader" :label="$t('services.explore')" @click="guestLogin" data-cy="login-explore-button"></q-btn>
        <q-btn-dropdown :menu-offset="[0, -130]" flat :ripple="false" class="q-mt-md">
            <template v-slot:label>
                <div class="row items-center no-wrap">
                  <img :src="parseImage($store.getters['user/getCurrentLanguage'])" width="25px" height="25px"/>
                  <div class="text-label text-capitalize font-normal q-ml-md">
                    {{ parseLanguage($store.getters['user/getCurrentLanguage']) }}
                  </div>
                </div>
            </template>
            <q-list style="width: 160px;">
              <q-item v-for="language in languageOptions" :key="language.value" clickable v-close-popup @click="changeLanguage(language.value)" >
                  {{ $t(language.label) }}
                  <img :src="language.icon" class="float-right text-right" style="position: absolute; right: 0;margin-right: 10px;" width="25px" height="25px" />
              </q-item>
            </q-list>
        </q-btn-dropdown>
        <div v-html="$t('signup.email.msg')" style="border: solid 1px lightgrey;border-radius: 10px;margin-top: 10vh;" class="q-pa-sm"></div>
      </div>
      <div v-else>
        <q-btn no-caps class="full-width q-mb-sm q-mt-md" data-cy="login-button" icon="mail" size="lg" color="primary" :label="$t('email')" @click.native="$router.push({name: 'LoginEmail', query: $route.query})"/>
        <div class="text-middle-line">
          <span class="lowercase text-label">{{ $t('or') }} {{ $t('continue.with') }}</span>
        </div>
        <q-btn no-caps class="full-width q-mb-md" size="lg" outline :loading="fbloading" @click.native="sendImpression('Login', 'FB'), onAuthFacebook()">
          <q-icon name="fab fa-facebook-f" class="facebook-color" style="height: 45px; width: 45px;"/>
          {{ $t('login.with.facebook') }}
        </q-btn>
        <q-btn no-caps class="full-width" size="lg" outline :loading="googleLoading" :disabled="googleLoading" @click.native="sendImpression('Login', 'G+'), onAuthGoogle()">
          <img src="statics/images/google_logo.png" style="height: 45px; width: 45px;" alt="">
          {{ $t('google') }}
        </q-btn>
        <div class="text-middle-line"></div>
        <h5 class="full-width text-center">
          {{ $t('dont.have.an.account') }} <span class="anchor-link" @click="$router.push({name: 'Signup', query: $route.query})">{{ $t("signup") }} </span>
        </h5>
      </div>
    </div>
  </q-page>
</template>

<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin'
import authFlowMixin from '../mixins/authFlowMixin.js'

export default {
  mixins: [authFlowMixin, languageSwitcherMixin],
  data () {
    return {
      loginSlider: '1',
      guestLoginLoader: false
    }
  },
  preFetch ({ store, redirect }) {
    try {
      console.log('check local storage', localStorage)
      const localUuid = localStorage.getItem('uuid')
      console.log('check uuid', localUuid)

      if (localUuid !== null && localUuid !== undefined) {
        redirect({ path: '/dashboard' })
      } else {
        console.log('localUuid is null or undefined')
        console.log('check user state also', store.state.user.access)
        store.state.user.access = false
      }
    } catch (error) {
      console.error('Error in preFetch:', error)
    }
  },

  created () {
    console.log('check if quasar load issue', this.$q.localStorage)

    try {
      this.$store.commit('user/updateUserFooterVisibilityState', false)
      this.$store.commit('user/updateUserReviewState', false)

      // Delay the execution by 2 seconds
      setTimeout(() => {
      // Hide the loader after the delay

        if (this.$store.getters['user/getUserAccessState'] && this.$store.getters['user/getUserUuidState']) {
          this.$router.replace({ name: 'MobileDashboard' })
        } else {
          this.$store.commit('user/updateGuestAccessState', false)
          this.sendImpression('Login Selection')
        }
      }, 500)

      if (this.$q.localStorage.has('localStoragePetInfo') && this.$route.query.redirect) {
        this.$router.replace({ query: null })
        this.$router.push({ name: 'SignupEmail' })
      }
    } catch (error) {
      console.error('Error in created:', error)
    }
  },

  mounted () {
    try {
      this.cacheExploreBanners()
    } catch (error) {
      console.error('Error in mounted:', error)
    }
  },
  methods: {
    changeLanguage (language) {
      try {
        this.$store.commit('user/updateUserLanguageState', language)
        this.switchLocale(language)
        this.cacheExploreBanners()
        this.$emit('toggleLanguageChange')
      } catch (error) {
        console.error('Error in changeLanguage:', error)
      }
    },
    parseLanguage (languageValue) {
      try {
        return this.$t(this.$_.findWhere(this.languageOptions, {'value': languageValue}).label)
      } catch (error) {
        console.error('Error in parseLanguage:', error)
        return ''
      }
    },
    parseImage (languageValue) {
      try {
        return this.$_.findWhere(this.languageOptions, {'value': languageValue}).icon
      } catch (error) {
        console.error('Error in parseImage:', error)
        return ''
      }
    },
    async cacheExploreBanners () {
      try {
        const response = await this.$axios.get(`banners?mobile=${this.$q.platform.is.mobile ? '1' : '0'}&language_id=${this.$_.findWhere(this.languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id}&country_id=${this.$store.getters['user/getUserMobileCountryId']}`
        )
        this.$store.dispatch('banners/cacheExploreBanners', response.data.bannerInfo)
      } catch (error) {
        console.error('Error in cacheExploreBanners:', error)
      }
    },
    guestLogin () {
      try {
        this.guestLoginLoader = true
        let langId = this.$_.findWhere(this.languageOptions, {'value': this.$store.getters['user/getCurrentLanguage']}).id
        if (this.$route.query.lang) {
          langId = this.$_.findWhere(this.languageOptions, {'value': this.$route.query.lang}).id
        }

        let info = {
          'accountInfo': {
            'pushId': this.$store.state.user.pushid || '444444',
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
        }

        this.$axios.post(`account/loginanonymous`, info
        ).then(response => {
          this._processGuest(response.data.accountInfo)
        }).catch(error => {
          console.error('Error in guestLogin:', error)
        }).finally(_ => {
          this.guestLoginLoader = false
        })
      } catch (error) {
        console.error('Error in guestLogin:', error)
        this.guestLoginLoader = false
      }
    }
  }
}
</script>

<template>
  <div class="row justify-center q-py-lg">
    <div class="row gutter-lg gt-sm">
      <div class="col-md-3">
        <p class="text-dark q-pl-xl">
          <b class="uppercase">{{ $t('app.footer.petbacker') }}</b>
        </p>
        <ul class="q-pl-xl">
          <li><a :href="$t('link.href.career')" target="_blank">{{ $t('app.footer.career') }}</a></li>
          <!-- <li><a :href="$t('link.href.blog')" target="_blank">{{ $t('app.footer.blog') }}</a></li> -->
          <li><a :href="$t('link.href.aboutus')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.aboutus') }}</a></li>
          <li><a :href="$t('link.href.help.center')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.helpcenter') }}</a></li>
          <!-- <li><a :href="$t('link.href.newsroom')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.newsroom') }}</a></li> -->
          <li><a :href="$t('link.href.termsuse')" target="_blank" rel="noreferrer noopener">{{ $t('requests.petboarding.agreement.termsofuse') }}</a></li>
          <li><a :href="$t('link.href.privacy.policy')" target="_blank" rel="noreferrer noopener">{{ $t('requests.petboarding.agreement.privacypolicy') }}</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <p class="text-dark q-pl-xl">
          <b class="uppercase">{{ $t('app.footer.petlover') }}</b>
        </p>
        <ul class="q-pl-xl">
          <li><a :href="$t('link.href.pet.sitter')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.bepetsitter') }}</a></li>
          <li><a :href="$t('link.href.bedogwalker')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.bedogwalker') }}</a></li>
          <li> <a :href="$t('link.href.mobile')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.mobileapp') }}</a></li>
          <li><a :href="$t('link.href.premium.insurance')" target="_blank" rel="noreferrer noopener">{{ $t('app.footer.premiumcoverage') }}</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <p class="text-dark q-pl-xl">
          <b class="uppercase">{{ $t('app.footer.petservices') }}</b>
        </p>
        <ul class="q-pl-xl">
          <li v-for="service in services" :key="service.name" v-close-popup @click="$router.push(service.link)">
            <a :href="service.link" target="_blank">{{ $t(service.name) }}</a>
          </li>
          <li v-close-popup @click="openNewTab($t('services.explore.link'))">
            <a :href="$t('services.explore.link')" target="_blank" rel="noreferrer noopener">{{ $t('services.explore') }}</a>
          </li>
        </ul>
      </div>
      <!--Desktop Language Footer-->
      <div class="col-md-3">
        <p class="text-dark q-pl-xl">
          <b class="uppercase">{{ $t('app.footer.contactus') }}</b>
        </p>
        <ul class="q-pl-xl">
          <li><a :href="$t('link.href.contact.us')" target="_blank" rel="noreferrer noopener"><q-icon name="email" /> {{ $t('app.footer.emailus') }}</a></li>
        </ul>
      </div>
      <div class="col-md-6">
        <p class="q-pl-xl text-grey">{{ $t('app.footer.copyright').replace('{year}', getCurrentYear()) }} | {{ $t('version') }}: {{ version }}</p>
      </div>
      <div class="offset-md-3 col-md-3">
        <q-btn-dropdown flat class="q-pl-xl border-none cursor-pointer background-select"  style="min-width: 150px; width: 190px">
         <template v-slot:label>
          <div class="row items-center no-wrap">
          <div class="text-label" style="margin-right: 37px">
             {{ $t(label) }}
          </div>
          <img style="height: 22px;width: 22px;" :src="language" class="img-right"/>
      </div>
        </template>
          <q-list>
            <q-item v-for="language in languageOptions" :key="language.value" clickable v-close-popup @click="changeLanguage(language.value)">{{ $t(language.label) }}
              <img :src="language.icon" class="img float-right" ><img/>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Mobile Language Footer-->
    <div class="row full-width gt-sm"  v-if="!$store.getters['user/getFooterVisibility'] && ($_.indexOf(hideLanguageFooter, $route.name) < 0) && !$q.platform.is.cordova" style="width: 96%;">
      <div class="col-md-6">
        <p class="q-pl-xl">{{ $t('app.footer.copyright').replace('{year}', getCurrentYear()) }} | {{ $t('version') }}: {{ version }}</p>
      </div>
      <div class="col-md-6 text-right q-pr-lg">
        <q-btn-dropdown flat class="q-pl-xl border-none cursor-pointer background-select"  style="min-width: 150px; width: 190px">
         <template v-slot:label>
          <div class="row items-center no-wrap">
          <div class="text-label" style="margin-right: 57px;">
             {{ $t(label) }}
          </div>
          <img style="height: 22px;width: 22px;" :src="language" class="img-right-mobile"/>
      </div>
        </template>
          <q-list>
            <q-item v-for="language in languageOptions" :key="language.value" clickable v-close-popup @click="changeLanguage(language.value)">{{ $t(language.label) }}
              <img :src="language.icon" class="img float-right" ><img/>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <div class="row lt-md" v-if="$store.getters['user/getFooterVisibility'] && ($_.indexOf(hideLanguageFooter, $route.name) < 0) && !$q.platform.is.cordova" style="width: 96%;">
      <div class="text-dark col-xs-6">
        <p class="text-dark">{{ $t('app.footer.copyright').replace('{year}', getCurrentYear()) }} | {{ $t('version') }}: {{ version }}</p>
      </div>
      <div class="text-dark col-xs-6">
        <q-btn-dropdown flat class="q-pl-xl border-none cursor-pointer background-select"  style="min-width: 150px; width: 190px">
         <template v-slot:label>
          <div class="row items-center no-wrap">
          <div class="text-label" style="margin-right: 37px">
             {{ $t(label) }}
          </div>
          <img style="height: 22px;width: 22px;" :src="language" class="img-right"/>
      </div>
        </template>
          <q-list>
            <q-item v-for="language in languageOptions" :key="language.value" clickable v-close-popup @click="changeLanguage(language.value)">{{ $t(language.label) }}
              <img :src="language.icon" class="img float-right" ><img/>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin.js'
import petServices from 'assets/services.json'
import moment from 'moment'

export default {
  mixins: [languageSwitcherMixin],
  data () {
    return {
      language: null,
      label: null,
      services: petServices,
      version: process.env.APP_VERSION,
      hideLanguageFooter: [
        'PetProfile',
        'CreateRequest',
        'ChatSupport',
        'Chat',
        'Listings',
        'JobChat',
        'JobSummary',
        'JobQuote',
        'RequestSummary',
        'ViewRequest',
        'ViewJob',
        'JobCalendar',
        'DogWalk',
        'CreateListing',
        'Notification',
        'AccountHistory',
        'Payout'
      ]
    }
  },
  created () {
    this.updateLanguageIcon()
  },
  computed: {
    languageChanged () {
      return this.$store.state.user.language
    }
  },
  watch: {
    languageChanged (newValue, oldValue) {
      this.updateLanguageIcon()
      this.$store.commit('user/updateUserLanguageState', newValue)
    }
  },
  methods: {
    openNewTab (link) {
      this.openUrl(link)
    },
    changeLanguage (language) {
      this.$store.commit('user/updateUserLanguageState', language)
      this.$emit('toggleLanguageChange')
      this.$route.query.lang = language
      this.updateLanguageIcon()
    },
    updateLanguageIcon () {
      //  check language change from url
      if (typeof (this.$route.query.lang) !== 'undefined') {
        this.$store.state.user.language = this.$route.query.lang
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
      //  update language ICON
      this.label = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).label
      this.language = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).icon
    },
    getCurrentYear () {
      return moment().year()
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  color: $grey
  text-decoration: none

a:hover
  text-decoration: underline

li
  list-style: none
  padding-top: 10px
  padding-bottom: 10px

.img
  position: absolute
  width: 22px
  height: 22px
  right: 0
  margin-right: 20px

.img-right
    float: right
    margin-right: 18px
    margin-left: 15px

.img-right-mobile
    margin-left: 10px
</style>

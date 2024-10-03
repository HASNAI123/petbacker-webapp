<template>
  <q-page padding class="row" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="margin-left: auto; margin-right: auto;">
    <div class="col-xs-3 col-md-3" style="border-right: 2px solid lightgrey;" @click="$router.push({name: 'PublicProfile', params: {userId: $store.state.user.uuid}})">
      <q-avatar style="height: 80px; width: 80px;">
        <img :src="$store.state.user.avatarImage" class="avatar responsive profile-img" alt="profile_photo"/>
      </q-avatar>
    </div>
    <div class="col-xs-9 col-md-9 q-pl-md">
      <h4 class="q-my-none">{{ $t('hey.im') }} <strong>{{ $store.state.user.username }}</strong></h4>
      <h5 class="q-my-none">{{ $store.state.user.email }}</h5>
      <div class="row">
        <div class="col-xs-12 col-md-12 q-pl-md" style="padding-left: 0px; margin-top: 15px;" v-if="$q.platform.is.mobile">
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
      <div class="row vertical-bottom">
        <!-- <q-btn rounded :label="$t('feedback')" color="primary" class="col-md-2 q-mx-xs q-mt-md" @click.native="openFeedbackForm"></q-btn> -->
        <q-btn rounded :label="$t('profile.wallet')" color="primary" class="col-md-2 q-mx-xs q-mt-md" @click.native="$router.push({name: 'AccountHistory'})"></q-btn>
        <q-btn rounded :label="$t('navbar.my.pets')" color="primary" class="col-md-2 q-mx-xs q-mt-md" @click.native="$router.push({name: 'MyPets'})" v-if="$q.platform.is.mobile"></q-btn>
        <q-btn rounded :label="$t('create.listing')" class="col-md-3 q-mx-xs q-mt-md" color="primary" @click="disclamerModal = true"></q-btn>
        <q-btn rounded :label="$t('identity.verification')" class="col-md-4 q-mx-xs q-mt-md" color="primary" @click="$router.push({name: 'IdentityVerification'})" outline></q-btn>
        <q-btn rounded :label="$t('navbar.talk.support')" class="col-md-3 q-mx-xs q-mt-md" @click="$router.push('/chat/support-help')" outline color="primary">
          <span class="notification-dot" v-if="this.$store.getters['user/getUnreadSupportMessage'] > 0"></span>
        </q-btn>
      </div>
      <div class="row">
        <q-btn rounded :label="$t('deactivate.account')" class="col-md-4 q-mx-xs q-mt-md deactivate-account-button" @click="deactivateInfo = true"/>
        <q-btn rounded :label="$t('navbar.logout')" class="col-md-2 q-mx-xs q-mt-md" color="negative" @click="onLogout" />
      </div>
    </div>

    <!-- Disclaimer Dialog -->
    <dialog-disclamer :trigger="disclamerModal" @on-close="updateDisclamerModal"></dialog-disclamer>

    <q-dialog v-model="deactivateInfo">
        <q-card style="overflow: visible; max-width: 355px;">
          <q-card-section style="max-width:275px">
            <div class="protection-bulb">
              <img src="statics/images/for-your-protection.jpg" class="protection-bulb-image">
            </div>
            <div class="bg-white-self">
              <div class="row justify-center column">
                <p class="q-title q-my-sm text-center protection-title text-weight-bold"> {{$t('deactivate.account')}} </p>
              </div>
              <div class="row text-justify q-mt-md">
                <div class="col-md-12 text-justify protection-desc">
                  <span>{{$t('deactivate.account.msg')}}</span>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="full-width q-mb-sm">
                  <q-btn class="full-width text-weight-bold deactivate-account-btn" @click="onDeactivateAccount" color="primary" :label="$t('deactivate.account')" />
                </div>
                <div class="full-width q-mb-sm">
                  <q-btn class="full-width text-weight-bold not-now-button" color="primary" :label="$t('not.now')" dense v-close-popup />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin'
export default {
  mixins: [languageSwitcherMixin],
  components: {
    'dialog-disclamer': () => import('components/CreateListing/DialogDisclamer.vue')
  },
  data () {
    return {
      deactivateInfo: false,
      disclamerModal: false,
      feedBackForms: {
        'en': `https://docs.google.com/forms/d/e/1FAIpQLSfQIAZ6g9RxwpUz2XqMvV1xMbhZjtjEUh4cZyEC27OQc75Cuw/viewform?entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_cn': `https://docs.google.com/forms/d/e/1FAIpQLSe2igQl0CEgcz1MrijgRfv9_CoZQYT_YSYviQDyoYQJy-2JzQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_tw': `https://docs.google.com/forms/d/e/1FAIpQLSdZ1nXKHCAf1rYOAK5_YbIyOXrxbcCoZJECFa-1tP9F3qreJQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`,
        'zh_hk': `https://docs.google.com/forms/d/e/1FAIpQLSdZ1nXKHCAf1rYOAK5_YbIyOXrxbcCoZJECFa-1tP9F3qreJQ/viewform?usp=pp_url&entry.71058350=${this.$q.platform.is.ios ? 'IOS' : 'Android'}`
      }
    }
  },
  created () {
    // update message inbox tab to allow better UX flow
    // user clicking to inbox from here expects to see jobs inbox
    this.$store.commit('user/updateMessageTabIndexState', 'tab-notifications')

    this.getAccountInfo()
    this.updateLanguageIcon()
  },
  mounted () {
    if (this.$route.query.createListing) {
      this.disclamerModal = true
    }
  },
  methods: {
    openFeedbackForm () {
      if (this.feedBackForms[this.$store.getters['user/getCurrentLanguage']] !== undefined) {
        this.openUrl(this.feedBackForms[this.$store.getters['user/getCurrentLanguage']])
      } else {
        this.openUrl(this.feedBackForms['en'])
      }
    },
    getAccountInfo () {
      this.$axios.get(`/account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$store.dispatch('user/updateUserStates', response)
      }).catch(error => {
        console.error(error)
        this.$q.notify({
          message: error.response.data.message,
          type: 'negative'
        })
      })
    },
    getListings () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/services`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: 'deactivation error',
          type: 'negative'
        })
      })
    },
    updateDisclamerModal (value) {
      this.disclamerModal = value
    },
    onLogout () {
      this.$router.push('/logout')
    },
    onDeactivateAccount () {
      this.$axios.delete(`account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.notify({
          message: this.$t('account.deactivated'),
          type: 'positive'
        })
        this.onLogout()
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: 'deactivation error',
          type: 'negative'
        })
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
        default: this.$store.state.user.language = 'en'
      }
      //  update language ICON
      this.label = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).label
      this.language = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).icon
    }
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
  }
}
</script>

<style lang="stylus" scoped>
.profile-img
  object-fit: cover
  height: 85px
  width: 85px

@media only screen and (min-width: 601px)
  .profile-img
    object-fit: cover
    height: 150px
    width: 150px
    margin-left: 30px;

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

.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px
.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size 20px
  color: #444

.bg-white-self
  background  #fff
  margin-top 30px
  border-radius 10px

.not-now-button
  opacity 0.3

.deactivate-account-button
  opacity: 0.8
  color #fff
  background #ddd
</style>

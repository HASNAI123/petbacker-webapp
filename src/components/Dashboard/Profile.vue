<template>
  <q-page padding :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="margin-left: auto; margin-right: auto;">
    <!-- Steps Left -->
    <steps-left v-if="$store.getters['user/getListingApprovalStatus'] === 0" :key="loaded"></steps-left>

    <!-- Profile -->
    <q-item>
      <q-item-section avatar @click="goTo('PublicProfile', {userId: $store.state.user.uuid})">
        <q-avatar style="height: 70px; width: 70px;">
          <img :src="$store.getters['user/getUserAvatarImage']" class="avatar responsive profile-img" alt="profile_photo"/>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1"><h5 class="q-my-none text-weight-bold text-capitalize">{{ $store.state.user.username }}</h5></q-item-label>
        <q-item-label class="text-secondary font-normal" @click="goTo('EditProfile', {userId: $store.state.user.uuid})">{{$t('tap.here.to.edit.profile')}}</q-item-label>
      </q-item-section>

      <q-item-section side class="q-mr-sm">
        <q-btn icon="qr_code_2" :ripple="false" round @click="triggerQrCodeModal(true)" @on-close="triggerQrCodeModal"></q-btn>
      </q-item-section>
    </q-item>

    <!-- User's Stats -->
    <div class="row q-mt-sm q-mb-md font-normal">
      <!-- Balance -->
      <div class="col-3 text-center" @click="goTo('AccountHistory')">
        <p class="q-my-none text-weight-medium">{{$t('balance')}}</p>
        <div v-if="walletInfo">
          <p class="q-my-none font-medium-title text-secondary">{{formatDigits(walletInfo.balance)}}</p>
          <p class="q-my-none text-weight-light font-x-small text-secondary">{{getCurrency(walletInfo.currencyId)}}</p>
        </div>
        <div v-else-if="$store.getters['user/getUserUuidState'] === null">
          <p class="q-my-none font-medium-title text-secondary">0</p>
          <p class="q-my-none text-weight-light font-x-small text-secondary">{{getCurrency($store.getters['user/getUserMobileCountryId'] ? $store.getters['user/getUserMobileCountryId'] : '234')}} </p>
        </div>
        <div class="q-ml-md" v-else>
          <q-skeleton width="65px" height="10px" class="q-my-xs"></q-skeleton>
          <q-skeleton width="30px" height="10px" class="q-my-xs q-ml-md"></q-skeleton>
        </div>
      </div>
      <!-- Credits -->
      <div class="col-3 text-center" @click="openUrl(`${$t('link.href.help')}/sponsors/what-are-credits-for`)">
        <p class="q-my-none text-weight-medium">{{$t('profile.credits')}}</p>
        <p class="q-my-none font-medium-title text-secondary">{{formatDigits($store.getters['user/getCredits'])}}</p>
      </div>
      <!-- Credits/Points -->
      <!-- <div class="col-3 text-center" @click="$router.push({name: 'Rewards'})">
        <p class="q-my-none text-weight-medium">Points</p>
        <p class="q-my-none font-medium-title text-secondary">{{formatDigits($store.getters['user/getPoints'])}}</p>
      </div> -->
      <!-- <div class="col-3 text-center">
        <p class="q-my-none text-weight-medium">Ranking</p>
        <p class="q-my-none font-medium-title text-secondary">33</p>
        <p class="q-my-none text-weight-light font-x-small text-secondary">
        <q-icon name="fas fa-star" class="star-color" size="9px"></q-icon>
          4.9
        </p>
      </div> -->
      <div class="col-3 text-center" @click="reviewModal = true">
        <p class="q-my-none text-weight-medium">{{$t('reviews.title')}}</p>
        <p class="q-my-none font-medium-title text-secondary">{{$store.getters['user/getReviewCount']}}</p>
        <p class="q-my-none text-weight-light font-x-small text-secondary" v-if="profileInfo && profileInfo.rating > 0">
          <q-icon name="fas fa-star" class="star-color" size="9px"></q-icon>
          {{profileInfo.rating ? (profileInfo.rating).toFixed(1) : 0}}
        </p>
      </div>
      <div class="col-3 text-center" @click="goTo('Badges')">
        <p class="q-my-none text-weight-medium">{{$t('profile.tasks')}}</p>
        <p class="q-my-none font-medium-title text-secondary">{{computeTasksRemains()}}/{{totalTask}}</p>
      </div>
    </div>

    <!-- Buttons Card -->
    <q-card class="q-mt-lg q-mb-sm q-mx-md" style="border-radius: 15px; padding-top:10px;">
      <!-- Top Row -->
      <q-card-section class="row font-small q-px-none q-py-xs q-pt-none">
        <!-- <div class="col-3 text-center" @click="$router.push({name: 'Rewards'})"> -->
        <div class="col-3 text-center" @click="triggerVoucherModal(true)">
          <img src="statics/images/Profile/promos-voucher.svg" alt="promos-voucher" style="width: 35px; height: 35px;" />
          <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('promocode.vouchercode')}}</p>
        </div>
        <div class="col-3 text-center" @click="goTo('Referrals')">
          <img src="statics/images/Profile/referral-program.svg" alt="referral-program.svg" style="width: 35px; height: 35px;" />
          <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('profile.referral.program')}}</p>
        </div>
        <div class="col-3 text-center" @click="goTo('FavoritedListings')">
          <img src="statics/images/Profile/my-favorites.svg" alt="my-favorites" style="width: 35px; height: 35px;" />
          <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('profile.my.favorites')}}</p>
        </div>
        <div class="col-3 text-center" @click="goTo('AccountHistory')">
          <img src="statics/images/Profile/balance.svg" alt="balance" style="width: 35px; height: 35px;" />
          <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('profile.wallet')}}</p>
        </div>
      </q-card-section>

      <!-- Bottom Row -->
      <q-card-section class="row font-small q-px-none q-pb-md q-pt-none" style="padding-top:5px;" >
    <div class="col-3 text-center" @click="goTo('MyPets')">
        <img src="statics/images/Profile/my-pets.svg" alt="My Pets" style="width: 35px; height: 35px;" />
        <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('navbar.my.pets')}}</p>
    </div>
    <div class="col-3 text-center" @click="goTo('Badges')">
        <img src="statics/images/Profile/my-badges.svg" alt="My Badges" style="width: 35px; height: 35px;" />
        <p class="q-my-none text-grey-8" style="line-height: 1.4em;">{{$t('profile.my.badges')}}</p>
    </div>
    <div class="col-3 text-center" @click="goTo('Sponsor')">
        <img src="statics/images/Profile/sponsor-membership.svg" alt="Sponsor Program" style="width: 35px; height: 35px;" />
        <p class="q-my-none text-grey-8 " style="line-height: 1.4em;">{{$t('profile.sponsor.program')}}</p>
    </div>
    <div class="col-3 text-center" @click="$router.push({ name: 'HelpCenter' })">
        <img src="statics/images/Profile/help-center.svg" alt="Help Center" style="width: 35px; height: 35px;" />
        <p class="q-my-none text-grey-8 pre-formatted" style="line-height: 1.4em;">{{$t('help.center')}}</p>
        <span style="margin-right: 14px;" class="notification-dot" v-if="this.$store.getters['user/getUnreadSupportMessage'] > 0"></span>
    </div>
</q-card-section>

    </q-card>

    <!-- Tabs -->
    <!-- <q-tabs v-model="profileTab" class="text-grey q-mx-md" active-color="primary" indicator-color="primary" align="justify">
      <q-tab name="services" content-class="text-capitalize font-title text-weight-medium">Listings</q-tab>
    </q-tabs>

    <q-tab-panels v-model="profileTab" animated >
      <q-tab-panel name="services">

        <card-horizontal-listing v-for="service in listingsInfo" :key="service.id" :serviceInfo="service" class="q-mb-md"></card-horizontal-listing>

        <q-card style="border-radius: 11px;" @click="disclamerModal = true"></q-card>
      </q-tab-panel>
    </q-tab-panels> -->

    <div class="q-mx-md q-mt-lg q-pb-lg">
      <h6 class="q-my-none q-mb-xs q-ml-sm">
        {{$t('listings')}}
        <div class="float-right q-my-none text-primary q-mr-sm" @click="triggerListingProcessModal(true)">
          <q-icon name="help_outline" size="sm"></q-icon>
        </div>
      </h6>

      <div v-if="listingsInfo">
        <!-- Service Card -->
        <card-horizontal-listing v-for="service in listingsInfo" :key="service.id" :serviceInfo="service" class="q-mb-md"></card-horizontal-listing>
      </div>

      <!-- Add Service Card -->
      <q-card style="border-radius: 11px;" @click="updateDisclamerModal(true)">
        <q-card-section class="q-pa-sm">
          <q-item class="q-pa-none">
              <!-- Image -->
              <q-item-section avatar style="height: 80px; width: 80px;" class="q-mr-sm bg-grey-3">
                <q-icon name="fas fa-plus" size="45px" color="primary" class="text-center" style="left: 26%;"></q-icon>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" class="q-my-none font-normal text-weight-medium">{{$t('add.pet.service')}}</q-item-label>
                <q-item-label lines="2" caption>{{$t('be.a.sitter')}}</q-item-label>
              </q-item-section>

              <!-- Right Arrow -->
              <q-item-section side>
                <q-icon name="chevron_right"></q-icon>
              </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <!-- Disclaimer Dialog -->
    <dialog-disclamer :trigger="disclamerModal" @on-close="updateDisclamerModal"></dialog-disclamer>

    <!-- Error Dialog -->
    <dialog-error :trigger="errorModal" :message="msg400" @on-close="closeErrorModal"></dialog-error>

    <!-- Voucher Dialog -->
    <dialog-voucher :trigger="voucherModal" @on-close="triggerVoucherModal" @on-error="showError" :countries="COUNTRIES"></dialog-voucher>

    <!-- Reviews Dialog -->
    <dialog-reviews v-if="$store.getters['user/getReviewCount'] > 0" :trigger="reviewModal" :reviewInfo="reviewInfo" @on-close="closeReviewModal"></dialog-reviews>

    <!-- Dialog listing process -->
    <q-dialog v-model="listingProcessModal" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card ref="disclamer-card">
            <!-- Header -->
            <q-toolbar class="fixed-top bg-white" style="z-index: 5000;">
              <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none header-title" style="margin-left: 21%;">{{$t('listing.process')}}</h6>
              </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pb-xl q-mb-xl q-pt-lg">
              <listing-process></listing-process>
            </q-card-section>

            <!-- Bottom Create Listing -->
            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;z-index: 4000;">
                <div class="q-pa-md q-pb-sm" @click="updateDisclamerModal(true)">
                    <div class="text-white text-center cursor-pointer font-header-title">
                        <p class="text-weight-bold font-title" style="margin-top: 5px;">{{ $t('create.listing') }}</p>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>

    <!-- QR code dialog -->
    <dialog-qrcode :trigger="qrcodeModal" @on-close="triggerQrCodeModal"></dialog-qrcode>
  </q-page>
</template>

<script>
import countries from 'assets/countries.json'
export default {
  components: {
    'dialog-disclamer': () => import('components/CreateListing/DialogDisclamer.vue'),
    'card-horizontal-listing': () => import('components/Listing/HorizontalListingCards.vue'),
    'listing-process': () => import('components/CreateListing/WhatsNext.vue'),
    'dialog-voucher': () => import('components/Vouchers/ModalVouchers.vue'),
    'dialog-reviews': () => import('components/Listing/DialogReviews.vue'),
    'dialog-error': () => import('components/Dialog400Error.vue'),
    'steps-left': () => import('components/StepsLeft/StepsLeftHeader.vue'),
    'dialog-qrcode': () => import('components/DialogQrCode.vue')
  },
  data () {
    return {
      profileInfo: null,
      reviewInfo: null,
      walletInfo: this.$store.getters['cached/getTransactionHistory'],
      listingsInfo: this.$store.getters['cached/getServicesCached'],
      profileTab: 'services',
      reviewModal: false,
      disclamerModal: false,
      listingProcessModal: false,
      voucherModal: false,
      errorModal: false,
      msg400: '',
      COUNTRIES: countries,
      loaded: false,
      totalTask: 7,
      qrcodeModal: false
    }
  },
  created () {
    // update message inbox tab to allow better UX flow
    // user clicking to inbox from here expects to see jobs inbox
    this.$store.commit('user/updateMessageTabIndexState', 'tab-notifications')
  },
  activated () {
    window.scrollTo(0, 0)
    if (this.$route.query.createListing === 1) {
      setTimeout(() => {
        this.disclamerModal = true
      }, 180)
    }

    if (this.$route.query.voucher === 1) {
      setTimeout(() => {
        // this.$router.push({name: 'Rewards'}) // points page
        this.triggerVoucherModal(true)
      }, 180)
    }

    setTimeout(() => { this.getAccountInfo() }, 0)
  },
  deactivated () {
    if (this.$route.query.createListing && this.$route.query.createListing === 1) {
      this.$route.query.createListing = 0
    }

    if (this.$route.query.voucher && this.$route.query.voucher === 1) {
      this.$route.query.voucher = 0
    }
  },
  computed: {
    languageChanged () {
      return this.$store.state.user.language
    }
  },
  watch: {
    languageChanged (newValue) {
      this.$store.commit('user/updateUserLanguageState', newValue)
    }
  },
  methods: {
    triggerQrCodeModal (status) {
      this.qrcodeModal = status
    },
    computeTasksRemains () {
      let taskDid = 0

      // check user verified email
      if (this.$store.getters['user/getEmailVerified'] === 1) {
        taskDid++
      }

      // check user verify phone number
      if (this.$store.getters['user/getUserMobileVerified'] === 1) {
        taskDid++
      }

      // check user verify identity (selfie and id)
      if ((this.$store.getters['user/getIdVerified'] === 1) && (this.$store.getters['user/getSelfieVerified'] === 1)) {
        taskDid++
      }

      // check user verify facebook
      if (this.$store.getters['user/getFacebookVerified'] === 1) {
        taskDid++
      }

      // check user verify google verified
      if (this.$store.getters['user/getGoogleVerified'] === 1) {
        taskDid++
      }

      // check user did pet sitter intro
      if (this.$store.getters['user/getSitterIntroVerified']) {
        taskDid++
      }

      // check user did pet online test
      if (this.$store.getters['user/getUserExamCertified']) {
        taskDid++
      }

      return taskDid
    },
    goTo (routeName, params) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', true, routeName)
        return
      }

      if (routeName === 'OfferService') {
        this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
        this.$route.query.createListing = 1
        return
      }

      this.$router.push({name: routeName, params: params})
    },
    closeReviewModal (status) {
      this.reviewModal = status
    },
    showError (errorMessage) {
      this.msg400 = errorMessage
      this.errorModal = true
    },
    closeErrorModal () {
      this.errorModal = false
    },
    triggerVoucherModal (status) {
      this.voucherModal = status
    },
    triggerListingProcessModal (status) {
      this.listingProcessModal = status
    },
    getCurrency (id) {
      return this.$_.findWhere(countries, {'id': id.toString()}).currencyCode
    },
    formatDigits (balance) {
      if (typeof balance === 'number') {
        return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else if (typeof balance === 'string') {
        return balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else if (balance === null || balance === '' || balance === undefined) {
        return 0
      }
    },
    getAccountInfo () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.reviewInfo = true
        this.profileInfo = true
        return
      }

      this.$axios.get(`/account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.profileInfo = response.data.accountInfo
        this.reviewInfo = response.data.accountInfo.reviewInfo
        this.loaded = true

        // update user states
        this.$store.dispatch('user/updateUserStates', response)

        // if (response.data.accountInfo.serviceInfo.services.length > 0) {
        this.listingsInfo = response.data.accountInfo.serviceInfo.services

        if (JSON.stringify(this.$store.getters['cached/getServicesCached']) !== JSON.stringify(response.data.accountInfo.serviceInfo.services)) {
          this.$store.dispatch('cached/cacheUserServices', response.data.accountInfo.serviceInfo.services)
        }
        // }
      }).catch(error => {
        console.error(error)
        if (error.response && error.response.data) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative',
            position: 'top'
          })
        }
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
      })
    },
    updateDisclamerModal (value) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerListingProcessModal(false)
        this.goTo('CreateListing')

        return
      }

      if (value === true) {
        this.sendImpression('Button Click', 'Create Listing - Profile', 'Become a Sitter')
      }

      this.disclamerModal = value
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

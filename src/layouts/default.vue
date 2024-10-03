<template>
  <q-layout view="lHh Lpr lFf" style="margin-left: auto;margin-right: auto;">
    <!-- <div v-if="$q.platform.is.browser">
      <vue-headful :url="this.$t('referral.link', {referralCode: $store.state.user.referralCode})"/>
    </div> -->

    <!-- Dialog Pop Up Loader (Pop Up and show gif while background loads) -->
    <dialog-popup-loader :trigger="popupLoader" @on-close="onTriggerPopUpLoader"></dialog-popup-loader>

    <!-- <notification-card></notification-card> -->
    <q-page-container>
      <layout-navbar ref="navbar" class="print-hide"
      @on-edit-service-rate="triggerEditServiceRate"
      @trigger-add-service-rate="triggerAddServiceRateDialog"
      @on-favorite="favoriteListing"
      @on-delete-personalItems="deletePersonalItem"
      @on-search-dialog="triggerSearchDialog"
      :quoteTypes="quoteTypes"
      @refresh-responseInfo="responseUserInfo"
      @refresh-quotedetails="onRefreshQuoteDetails"
      :percentage="percentage"
      @back-clicked="reduceUserCount"
      @cancel-request="cancelRequest"
      :count="count"
      :responseInfo="responseInfo"
      :serviceTitle="serviceName"
      @refresh-view="triggerRefresh"></layout-navbar>
        <router-view
        ref="current-view"
        :key="$route.fullPath"
        :userCount="count"
        @service-name="serviceLabel"
        @percentage="updatePercentage"
        @current-count="updateUserCount"
        @get-response-user-info="responseUserInfo"
        :updatedEmail="forgetLoginEmail"
        @update-email="updateEmail"
        @quote-types-options="getQuoteTypes"
        @trigger-discount-dialog="triggerDiscountModal"
        @on-addquoteitems="triggerQuoteItemsModal"
        @search-info="onSearch"
        @on-loading="onLoading"
        @listing-name="onListingLoad"
        @listing-favorite="listingIsFavorite"
        @show-edit-button="showEditServiceRateButton"
        @update-edit-button-status="updateEditButtonStatus"
        @trigger-popup="onTriggerPopUpLoader"
        @show-edit-footer="triggerEditFooter"
        @on-edit-selection="onEditSelection"></router-view>
      <layout-footer class="print-hide" v-if="footerVisibility && !$q.platform.is.cordova"></layout-footer>
    </q-page-container>
    <mobile-navbar-footer @refresh-view="triggerRefresh" @on-trigger-edit="triggerEditMode" ref="footer-navbar"></mobile-navbar-footer>

    <!-- Dialog Add Pets -->
    <dialog-add-pets></dialog-add-pets>
  </q-layout>
</template>

<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin.js'

export default {
  mixins: [languageSwitcherMixin],
  components: {
    'dialog-popup-loader': () => import('components/DialogPopUpLoader.vue'),
    'layout-navbar': () => import('./navbar.vue'),
    'mobile-navbar-footer': () => import('components/MobileNavbarFooter.vue'),
    'layout-footer': () => import('./footer.vue'),
    // 'notification-card': () => import('components/PushNotification/NotificationCard.vue'),
    'dialog-add-pets': () => import('components/DialogAddPet.vue')
  },
  data () {
    return {
      count: null,
      userCount: null,
      responseInfo: null,
      serviceName: null,
      forgetLoginEmail: null,
      percentage: 0,
      quoteTypes: [],
      popupLoader: this.$store.getters['user/getUserAccessState']
    }
  },
  preFetch ({ store }) {
    store.dispatch('user/init').then(() => {
      store.commit('user/updateUserCurrentMobileTab', 'services.explore')
      store.dispatch('geolocation/cacheGeoLocation')
    }).then(() => {
      store.dispatch('chat/init')
      store.dispatch('bookings/init')
      store.dispatch('search/init')
      store.dispatch('search/clearSearchCache')
    }).catch((error) => {
      console.error(error)
    })
  },
  created () {
    console.log('width', screen.width)
    console.log('height', screen.height)
    this.updateUserLocale()
    this.updateNavbarVisibility()
    // this.askTrackingPermission()
  },
  mounted () {
    if (this.$route.name !== 'MobileDashboard' || (this.$store.getters['user/getUserCurrentMobileTab'] !== 'services.explore')) {
      setTimeout(() => {
        this.popupLoader = false
      }, 2000)
    }
    document.addEventListener('click', this.openLink)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.openLink)
  },
  computed: {
    currentRoute () {
      return this.$route.name
    },
    footerVisibility () {
      return this.$store.getters['user/getFooterVisibility']
    }
  },
  watch: {
    currentRoute (value, fromRoute) {
      if (this.$store.getters['user/getUserAccessState'] && (value === 'Index' || fromRoute === 'Index' || fromRoute === 'LoginEmail' || fromRoute === 'OAuthFacebook' || fromRoute === 'SignupEmail' || fromRoute === 'ReferralSignup')) {
        setTimeout(() => {
          this.popupLoader = true
        }, 0)
      }

      if (this.$route.name !== 'MobileDashboard' || (this.$store.getters['user/getUserCurrentMobileTab'] !== 'services.explore')) {
        setTimeout(() => {
          this.popupLoader = false
        }, 1800)
      }
    }
  },
  // metaInfo () {
  //   return {
  //     meta: [
  //       {property: 'fb:app_id', content: 1441906625823904},
  //       {property: 'og:type', content: this.$t('fbmeta.type')},
  //       {property: 'og:title', content: this.$t('fbmeta.title')},
  //       {property: 'og:url', content: this.$t('fbmeta.url')},
  //       {property: 'og:image', content: this.$t('fbmeta.image')},
  //       {property: 'og:image:alt', content: this.$t('fbmeta.title')},
  //       {property: 'og:description', content: this.$t('fbmeta.description')}
  //     ],
  //     title: 'PetBacker'
  //   }
  // },
  methods: {
    // askTrackingPermission () {
    //   console.log('app version', window.device.version)
    //   if (this.$q.platform.is.cordova && this.$q.platform.is.ios && (parseFloat(window.device.version) >= 14.0)) {
    //     if (window.cordova) {
    //       console.log('trying to request permission ')
    //       window.cordova.exec((res) => {
    //         console.log('success ' + JSON.stringify(res))
    //       }, (res) => {
    //         console.log('fail ' + JSON.stringify(res))
    //       }, 'idfa', 'requestPermission', [])
    //     }
    //   }
    // },
    onEditSelection (info) {
      this.$refs['footer-navbar'].triggerEditDone(info)
    },
    triggerEditMode (status) {
      this.$refs['current-view'].triggerEditMode(status)
    },
    triggerEditFooter (status) {
      this.$refs['footer-navbar'].triggerEditNavbar(status)
    },
    onLoading (status) {
      this.$refs['navbar'].loadingStatus(status)
    },
    openLink (e) {
      // ensure is an a tag
      if (e.target.nodeName === 'A') {
        e.preventDefault()
        console.log('inside global link: ' + e.target.href)
        this.openUrl(e.target.href)
      } else if (e.target.parentNode && e.target.parentNode.nodeName === 'A') {
        console.log('inside global link: ' + e.target.parentNode.href)
        this.openUrl(e.target.parentNode.href)
      }
      e.stopPropagation()
    },
    cancelRequest () {
      this.$refs['current-view'].cancelRequest()
    },
    onTriggerPopUpLoader (status) {
      this.popupLoader = status
    },
    updateEditButtonStatus (value) {
      this.$refs['navbar'].updateEditButton(value)
      if (this.$route.name !== 'Listing') {
        this.triggerEditServiceRate(value)
      }
    },
    showEditServiceRateButton (value) {
      this.$refs['navbar'].showEditRateButton(value)
    },
    triggerEditServiceRate (value) {
      if (this.$route.name === 'CreateListing') {
        if (this.count === 5) {
          this.$refs['current-view'].onEditImages(value)
        } else if (this.count === 6) {
          this.$refs['current-view'].onEditMoreImages(value) // to allow edit of housing images
        } else {
          this.$refs['current-view'].onEditRates(value)
        }
      } else {
        if (this.$refs['current-view'].onEditRates) {
          this.$refs['current-view'].onEditRates(value)
        }
      }
    },
    triggerAddServiceRateDialog () {
      this.$refs['current-view'].triggerAddServiceRateModal(true)
    },
    favoriteListing () {
      this.$refs['current-view'].favorite()
    },
    onSearch (searchInfo) {
      if (searchInfo && searchInfo.location) {
        this.$refs['navbar'].headerBreadcrumbs(searchInfo.location.fullAddress)
      } else if (searchInfo) {
        this.$refs['navbar'].headerBreadcrumbs(searchInfo)
      } else {
        this.$refs['navbar'].headerBreadcrumbs(null)
      }
    },
    onListingLoad (listingName, shareUrl) {
      this.$refs['navbar'].updateListingName(listingName)
      this.$refs['navbar'].insertListingUrl(shareUrl)
    },
    listingIsFavorite (status) {
      this.$refs['navbar'].showListingIsFavorite(status)
    },
    triggerSearchDialog (value) {
      this.$refs['current-view'].triggerSearchModal(value)
    },
    deletePersonalItem (personalItemId) {
      this.$refs['current-view'].onDelete(personalItemId)
    },
    triggerRefresh (content = null) {
      switch (this.$route.name) {
        // To be called when needed to refresh chat
        case 'Chat':
        case 'JobChat':
          this.$refs['current-view'].refreshChat()
          break
        // To be called in front 5 main pages (explore, requests, moments, jobs, profile)
        case 'MobileDashboard':
          if (this.$store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments') {
            this.$refs['current-view'].refreshMoment(content)
          } else if (this.$store.getters['user/getUserCurrentMobileTab'] === 'mobile.navbar.jobs') {
            this.$refs['current-view'].refreshJobs()
          }
          break
        case 'Messages':
          if (this.$store.getters['user/getMessageTabIndex'] === 'tab-notifications') {
            this.$refs['current-view'].refresh('tab-notifications')
          }
          break
      }
    },
    triggerDiscountModal () {
      setTimeout(() => {
        this.$refs['navbar'].openDiscountDialog()
      }, 100)
    },
    triggerQuoteItemsModal () {
      this.$refs['navbar'].openQuoteDetail()
    },
    onRefreshQuoteDetails () {
      this.$refs['current-view'].onRefresh()
    },
    updateNavbarVisibility () {
      if (this.$route.query.fullscreen) {
        switch (this.$route.query.fullscreen) {
          case '1': this.$store.commit('user/updateUserNavbarVisibilityState', false); break
          case '0': this.$store.commit('user/updateUserNavbarVisibilityState', true); break
        }
      }
    },
    updateUserLocale () {
      if (this.$route.query.lang) {
        this.switchLocale(this.$route.query.lang, true)
      } else if (window.location.host === 'web.petbacker.com.tw') {
        this.switchLocale('zh_tw', true)
      }
    },
    updateUserCount (value) {
      this.count = value
    },
    reduceUserCount (value) {
      this.count = value - 2
    },
    responseUserInfo (value) {
      console.log('default:', value)
      this.responseInfo = value
    },
    serviceLabel (value) {
      this.serviceName = value
    },
    updateEmail (value) {
      this.forgetLoginEmail = value
    },
    updatePercentage (value) {
      this.percentage = value
    },
    getQuoteTypes (options) {
      this.quoteTypes = options
    }
  }
}
</script>

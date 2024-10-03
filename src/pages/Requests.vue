<template>
  <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
    <q-pull-to-refresh @refresh="refreshRequestPage">
      <div :style="{'min-height': $q.platform.is.mobile ? '190px;' : '330px'}">
        <img src="statics/images/Requests-Center.png" v-if="$q.platform.is.mobile" height="190px" width="100%" style="object-fit:cover;" />
        <img src="statics/images/Requests-Center-desktop.jpg" v-else height="330px" width="100%" style="max-height:auto;object-fit:cover;" />
      </div>

      <!-- Tabs -->
      <q-card style="border-radius: 10px;" class="request-card-position">
          <q-card-section class="q-pb-sm q-pt-none q-px-sm text-center row text-primary">
              <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 45px;">
                  <div class="q-px-sm selected-button" style="border-radius:50px;height:45px;margin-top: 10%;">
                    <q-icon name="fas fa-clipboard-list" style="margin-top: 23%;" size="30px"></q-icon>
                  </div>
                  <p class="font-x-small text-primary q-my-none font-x-small">{{$t('mobile.navbar.requests')}}</p>
              </div>
              <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 61px;" @click="$router.push({name: 'Services'})">
                  <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                      <q-icon name="img:statics/icons/custom-icon/make-request.png" size="35px"></q-icon>
                  </div>
                  <p class="font-x-small text-primary q-my-none font-x-small">{{$t('navbar.getservices')}}</p>
              </div>
              <!-- <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 55px;" @click="petSelectionModal = true">
                  <div class="q-pa-sm" style="border-radius:50px;height:55px;">
                      <q-icon name="fas fa-paw" size="35px"></q-icon>
                  </div>
                  <p class="font-x-small text-grey">Dog Walk</p>
              </div> -->
              <div class="col-md-3 col-xs-3 q-mr-sm q-ml-xs" style="width: 52px;" @click="futureUpdateModal = true">
                  <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                      <q-icon name="fas fa-paw" style="margin-top: 10%;" size="30px"></q-icon>
                  </div>
                  <p class="font-x-small text-primary q-my-none font-x-small">{{$t('dog.walk')}}</p>
              </div>
              <div class="col-md-3 col-xs-3 q-mx-xs" style="width: 65px;" @click="$router.push({name: 'ChatSupportHelp'})">
                  <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                      <q-icon name="img:statics/icons/custom-icon/help-center.png" size="35px"></q-icon>
                  </div>
                  <p class="font-x-small text-primary q-my-none font-x-small">{{$t('app.footer.helpcenter')}}</p>
              </div>
          </q-card-section>
      </q-card>

      <!-- My Requests -->
      <q-page class="row justify-center">
        <div class="col-md-9 col-xs-12" v-if="requests" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
          <!-- <div class="row" :class="{'q-mt-xs': $q.platform.is.mobile}" v-if="requests !== 'NO CONTENT'">
            <div class="col-xs-6 q-pl-sm">
              <p class="q-my-sm text-uppercase"><strong>{{ $t('navbar.requests') }}</strong></p>
            </div>
            <div class="col-xs-6 text-right">
              <q-btn :label="$t('requests.page.makerequest')" @click.native="$router.push('/services')"/>
            </div>
          </div> -->

          <!-- Requests -->
          <q-infinite-scroll class="q-pb-lg animate-popup-down" v-if="this.requests !== 'NO CONTENT'" >
            <request-card v-for="requestInfo in requests" :request="requestInfo" :key="requestInfo.id" class="q-my-lg" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''"></request-card>
          </q-infinite-scroll>
          <div v-else class="row">
            <div class="col-xs-12 text-center" @click="$router.push({name: 'Services'})">
              <img src="statics/images/pet-sitter-300x200.png" alt="Pet sitter">
            </div>
            <div class="col-xs-12 text-center q-mb-xl" @click="$router.push({name: 'Services'})">
              <h3 class="q-mt-none" v-if="$q.platform.is.desktop">{{ $t('requests.page.createfirstrequest') }}</h3>
              <h4 class="q-my-none q-mb-xs" v-else>{{ $t('requests.page.createfirstrequest') }}</h4>
              <p>{{ $t('requests.page.makefirstrequest') }}</p>
              <q-btn class="bg-white" :label="$t('requests.page.makerequest')"  @click="$router.push({name: 'Services'})"></q-btn>
            </div>
          </div>
        </div>
        <div class="col-xs-12 text-center" v-else>
          <ComponentPreLoader></ComponentPreLoader>
        </div>

        <q-dialog v-model="stepByStep" :content-css="{minWidth: '40vw', minHeight: '80vh'}" :maximized="mobileView" :transition-hide="transitionHideSummary" :transition-show="transitionShowSummary">
          <q-card>
            <q-toolbar>
              <q-btn
                flat
                round
                dense
                v-close-popup
                icon="keyboard_arrow_left"
              />
              <q-toolbar-title v-close-popup>
                {{ $t('button.backtorequest') }}
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section class="layout-padding row justify-center">
              <h5 class="text-center">{{ $t('when.receive.quote') }}</h5>
              <img class="responsive img-height" src="statics/images/inbox-icon.png" alt="">
            </q-card-section >
          </q-card>
        </q-dialog>

        <q-dialog v-model="stepByStepModal" :content-css="{minWidth: '30vw', minHeight: '97vh'}">
          <q-card>
            <q-toolbar>
              <q-btn
                flat
                round
                dense
                v-close-popup
                icon="keyboard_arrow_left"
              />
              <q-toolbar v-close-popup>
                {{ $t('button.backtorequest') }}
              </q-toolbar>
            </q-toolbar>
            <q-carousel color="white" arrows style="height: 100%;">
              <q-carousel-slide class="responsive" v-for="num in 5" :key="num" :img-src="getSlideShowLanguage(num)" />
            </q-carousel>
          </q-card>
        </q-dialog>
        <q-dialog v-model="modalOpenPromo" :content-css="{minWidth: '400px', minHeight: '640px'}">
          <q-card :content-style="'overflow: hidden !important;'">
            <q-toolbar>
              <q-btn
                flat
                round
                dense
                v-close-popup
                icon="close"
                style="float: right;position: absolute;right: 14px;top: 11px;"
              />
            </q-toolbar>
              <a :href="$t('modal.promo.img.link')" target="_blank" rel="noreferrer noopener">
                <img class="full-width responsive" src="https://storage.googleapis.com/petbacker/images/cms/banners/promo-en.jpg" alt="">
              </a>
          </q-card>
        </q-dialog>

        <!-- Pop-up Booking -->
        <transition :duration="{duration: 600}" name="slide">
          <notifications v-if="popup_show" group="custom-template" position="bottom right">
            <template slot="body">
              <div class="popup">
                <q-icon name="close" class="cursor-pointer absolute-top-right" @click.native="closePopUp"></q-icon>
                <img :src="this.popup_avatar" class="popup_image"/><span v-html="this.popup_content" class="popup_text"></span>
              </div>
            </template>
          </notifications>
        </transition>
      </q-page>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
/* global bugsnagClient */
/* global inArray */
import showFooterMixin from '../mixins/showFooterMixin.js'
import languages from 'assets/languages.json'

export default {
  mixins: [showFooterMixin],
  components: {
    'request-card': () => import('components/Requests/RequestCard.vue')
  },
  data () {
    return {
      requests: null,
      stepByStep: false,
      totalPage: null,
      stepByStepModal: false,
      modalOpenPromo: false,
      popup_content: null,
      popup_avatar: null,
      interval: null,
      duration: 30000,
      modalMoreOptions: false,
      subLabelKey: 0,
      currentLanguage: this.$store.state.user.language,
      requestsInterval: null,
      popup_show: true,
      loading1: false,
      slide: 1,
      currentRequest: -1,
      modalRequestSummary: false,
      mobileView: false,
      transitionHideSummary: 'default',
      transitionShowSummary: 'default',
      imageSize: '',
      imageBookingOff: '',
      imagePack: null,
      pageCount: 1,
      loadingMore: false,
      count: 0,
      hidden: false,
      urlLink: null,
      downloadGIF: null,
      delete: false,
      listingUnavailable: false,
      cancelRequest: false,
      cancelPage: 0,
      cancelMessage: null,
      bannersInfo: []
      // modalOpenPromo: this.$q.cookies.get('modalOpenPromo') !== 'opened'
    }
  },
  created () {
    // update message inbox tab to allow better UX flow
    // user clicking to inbox from here expects to see jobs inbox
    this.$store.commit('user/updateMessageTabIndexState', 'tab-requests')
    this.getBannerInfo()
    this.adjustImgSize()
    this.getRequests()
  },
  mounted () {
    this.$q.localStorage.remove('localStorageFormResponseInfo')
    this.$q.localStorage.remove('localStorageRequestInfo')
    this.$q.localStorage.remove('globalStorageReferralUserInfo')
    /*  setTimeout(() => {
      // this.setModalOpenPromoCookie()
    }, 5000) */
    if (!this.$q.platform.is.cordova && !this.$q.platform.is.mobile) {
      this.interval = setInterval(this.checkBookings, this.duration)
    }

    this.requestsInterval = setInterval(this.getRequests, 30000)
  },
  beforeDestroy () {
    clearInterval(this.requestsInterval)
    clearInterval(this.interval)
  },
  computed: {
    lang () {
      return this.$store.state.user.language
    }
  },
  watch: {
    // detect language change
    lang (newLang, oldLang) {
      this.imageBookingOff = 'statics/images/header/your-5th-booking-off-' + this.imageSize + newLang + '.jpg'
      this.downloadGIF = 'statics/images/gif/dog_walk_' + this.imageSize + newLang + '.jpg'
      this.getBannerInfo(true)
      this.getRequests()
    }
  },
  methods: {
    refreshRequestPage (done) {
      this.$store.dispatch('cached/clearRequestsPageCached')
      this.getBannerInfo()
      this.adjustImgSize()
      this.getRequests()
      setTimeout(() => {
        done()
      }, 1500)
    },
    closeCancelModal () {
      this.cancelRequest = false
      this.cancelPage = 0
    },
    refresher (index, done) {
      // setTimeout(() => {
      //   let items = []
      //   for (let i = 0; i < 7; i++) {
      //     items.push({})
      //   }
      //   this.items = this.items.concat(items)
      //   done()
      // }, 2500)
    },
    /*  loadMore () {
      this.loadingMore = true
      this.pageCount++
      this.getRequests()
      setTimeout(() => { this.loadingMore = false }, 1200)
    },  */
    toMessagePage (status, requestId, responseId) {
      if (status === this.STATUS.ACCEPTANCE_SITTER_ACCEPT || status === this.STATUS.ACCEPTANCE_PARENT_ACCEPT) {
        this.$router.push('chat/request/' + requestId + '/response/' + responseId)
      } else {
        this.$q.notify({
          message: this.$t('no.response.yet.chat'),
          timeout: 1200
        })
      }
    },
    getBannerInfo (languageChanged = false) {
      if (this.$store.getters['banners/getRequestsBanners'] && !languageChanged) {
        this.bannersInfo = this.$store.getters['banners/getRequestsBanners']
      } else {
        this.$axios.get(`banners?mobile=${this.$q.platform.is.mobile ? '1' : '0'}&language_id=${this.$_.findWhere(languages, {'value': this.$store.getters['user/getCurrentLanguage']}).id}&country_id=${this.$store.getters['user/getUserMobileCountryId']}`
        ).then(response => {
          this.bannersInfo = response.data.bannerInfo
          this.$store.dispatch('banners/cacheRequestsBanners', this.bannersInfo)
        }).catch(error => {
          console.error(error)
        })
      }
    },
    checkImg (url) {
      let lang = this.$store.getters['user/getCurrentLanguage']

      switch (lang) {
        case 'zh_tw': lang = 'zhtw'; break
        case 'zh_cn': lang = 'zhcn'; break
        case 'zh_hk': lang = 'zhhk'; break
      }

      /*  this.$axios.get(`${url}${this.imageSize}${lang}.jpg`
      ).then(response => {
        // allowed on certain images to appear in geolocation 'MY'
        if (this.$store.state.geolocation.data.geoplugin_countryCode !== 'MY' && url === 'https://storage.googleapis.com/petbacker/images/cms/promotions/pet-care-pack-') {
          this.imagePack = `https://storage.googleapis.com/petbacker/images/cms/promotions/your-5th-booking-off-${this.imageSize}${lang}.jpg`
          this.urlLink = ''
        } else {
          this.imagePack = `${url}${this.imageSize}${lang}.jpg`
          this.urlLink = 'https://www.petbacker.com/products/subscriptions-my?utm_source=webapp&utm_medium=web&utm_campaign=care-pack-promo-my'
        }
        this.imageBookingOff = `${url}${this.imageSize}${lang}.jpg`
        return true
      }).catch(() => {
        console.log('Image not found in server')
      })

      // fall back to english images
      if (url === 'https://storage.googleapis.com/petbacker/images/cms/promotions/pet-care-pack-' && this.$store.state.geolocation.data.geoplugin_countryCode === 'MY') {
        this.imagePack = `statics/images/header/pet-care-pack-${this.imageSize}en.jpg`
        this.urlLink = 'https://www.petbacker.com/products/subscriptions-my?utm_source=webapp&utm_medium=web&utm_campaign=care-pack-promo-my'
      } else {
        this.imagePack = `statics/images/header/your-5th-booking-off-${this.imageSize}en.jpg`
        this.urlLink = ''
      }
      this.imageBookingOff = `statics/images/header/your-5th-booking-off-${this.imageSize}en.jpg` */
    },
    fallBackImg (type) {
      if (type === 'bookingOff') {
        this.imageBookingOff = 'statics/images/header/your-5th-booking-off-' + this.imageSize + 'en.jpg'
      } else if (type === 'download') {
        this.downloadGIF = 'statics/images/gif/dog_walk_' + this.imageSize + 'en.jpg'
      }
    },
    adjustImgSize () {
      if (this.$q.platform.is.mobile && (!this.$q.platform.is.ipad)) {
        this.imageSize = '1024-'
      }
      this.downloadGIF = 'statics/images/gif/dog_walk_' + this.imageSize + this.$store.getters['user/getCurrentLanguage'] + '.jpg'
      this.imageBookingOff = 'statics/images/header/your-5th-booking-off-' + this.imageSize + this.$store.getters['user/getCurrentLanguage'] + '.jpg'
    },
    toViewScreen () {
      if (this.currentRequest !== -1) {
        this.$router.push({ name: 'RequestSummary', params: {requestId: this.currentRequest.id} })
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    toEditScreen () {
      if (this.currentRequest !== -1) {
        this.$router.push({ name: 'EditRequest', params: {requestId: this.currentRequest.id} })
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    toCancel () {
      if (this.currentRequest !== -1) {
        this.onCancelRequest(this.currentRequest.id, this.currentRequest.serviceName)
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    promptAvatar () {
      if (this.$q.platform.is.mobile) {
        this.mobileView = true
        this.transitionHideSummary = 'slide-right'
        this.transitionShowSummary = 'slide-left'
      }
      this.stepByStep = true
    },
    getRequests () {
      if (this.$store.getters['cached/getRequestsCached']) {
        this.requests = this.$store.getters['cached/getRequestsCached']
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/requests?page=${this.pageCount}&v=6`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (response.data) {
          this.requests = response.data.requestInfo.items
          /*
          for (let i = 0; i < this.requests.length; i++) {
            this.items.splice(0 + this.count, 0, response.data.requestInfo.items[i])
            this.count++
          }
          */
          this.subLabelKey += 1
          this.$store.dispatch('cached/cacheRequests', this.requests)
        } else {
          this.requests = 'NO CONTENT'
        }
      }).catch(error => {
        this.forceLogout(error)
        if (this.loadingMore) {
          this.$q.notify({
            message: 'No more requests to load'
          })
          this.hidden = true
          console.log('NO MORE REQUESTS TO LOAD')
        } else {
          console.error(error)
          let lang = this.$store.getters['user/getCurrentLanguage']
          let path = `users/${this.$store.state.user.uuid}/requests?page=${this.pageCount}&v=6`
          bugsnagClient.notify(new Error(error), {
            beforeSend: function (report) {
              report.metaData = {
                accountInfo: {
                  language: lang,
                  url: path
                },
                error: {
                  error: error
                }
              }
            }
          })
        }
      })
    },
    onCancelRequest (requestId, requestServiceName) {
      let confirm = this.$t('confirmation')
      let message = this.$t('confirmation.cancel.request', {requestServiceName: requestServiceName})
      if (this.delete) {
        message = this.$t('confirmation.delete.request', {requestServiceName: requestServiceName})
      }
      let yes = this.$t('yes')
      let no = this.$t('no')
      this.$q.dialog({
        title: confirm,
        message: message,
        ok: yes,
        cancel: no
      }).onOk(() => {
        this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${requestId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          if (this.cancelMessage !== null) {
            //  this.messageBox = `Request [${requestId}] has been cancelled \nReason:\n this.cancelMessage`
            //  this.sendSupportMessage()
          }
          //  this.messageBox = null

          this.modalMoreOptions = false
          this.getRequests()
          let message = this.$t('request.succesfully.cancelled', {requestServiceName: requestServiceName})
          if (this.delete) {
            message = this.$t('request.deleted', {requestServiceName: requestServiceName})
          }
          setTimeout(() => {
            this.$q.notify({
              message: message
            })
          }, 850)
          this.delete = false
        }).catch(error => {
          console.error(error)
          if (this.delete) {
            bugsnagClient.notify(new Error(requestServiceName + ' (' + requestId + ')  request failed to be deleted'))
            this.$q.notify({
              message: this.$t('request.deleted.failed', {requestServiceName: requestServiceName})
            })
          } else {
            this.$q.notify({
              message: this.$t('request.fail.cancelled', {requestServiceName: requestServiceName}),
              type: 'negative'
            })
            bugsnagClient.notify(new Error(requestServiceName + ' (' + requestId + ')  request failed to be cancelled'))
          }
        })
      }).onCancel(() => {
        if (this.delete) {
          this.delete = false
        }
      })
    },
    trackClickEvent (category, label, action = 'Button Click') {
      let dataLayer = window.dataLayer || []
      dataLayer.push({'event': 'trackEvent', 'category': category, 'action': action, 'label': label})
    },
    setModalOpenPromoCookie () {
      if (!this.$q.cookies.get('modalOpenPromo')) {
        let COOKIE_EXPIRATION_DAYS = 100
        this.$q.cookies.set('modalOpenPromo', 'opened', COOKIE_EXPIRATION_DAYS)
      }
    },
    getSlideShowLanguage (num) {
      let ALLOWED_LANGUAGE = [
        'en',
        'zhcn'
      ]

      let slideImageLang = null

      if (inArray(this.$store.state.user.language, ALLOWED_LANGUAGE)) {
        slideImageLang = this.$store.state.user.language
      }

      if (slideImageLang === null) {
        slideImageLang = 'en'
      }

      return `statics/images/steps/${slideImageLang}/step${num}.jpg`
    },
    closeRequest (requestID, responseInfo, status) {
      this.loading1 = true
      if (status === this.STATUS.REQUEST_STATUS_IN_PROGRESS) {
        let confirmation = this.$t('confirmation')
        let message = this.$t('mark.complete.before.review')
        let yes = this.$t('yes')
        let no = this.$t('no')
        this.$q.dialog({
          title: confirmation,
          message: message,
          ok: yes,
          cancel: no
        }).onOk(() => {
          this.$route.params.response = responseInfo.items[0].id
          this.$route.params.request = requestID
          this.markRequestComplete(responseInfo)
        })
      } else {
        this.$router.push({ name: 'ReviewVerified', params: {request: requestID, response: responseInfo.items[0].id} })
      }

      setTimeout(() => {
        this.loading1 = false
      }, 3000)
    },
    timerIncrement () {
      this.duration += 30000
      clearInterval(this.interval)
      this.interval = setInterval(this.checkBookings, this.duration)
    },
    closePopUp () {
      this.popup_show = false
    },
    checkBookings () {
      this.timerIncrement()
      let domain = this.checkLanguage()
      let city = this.$store.state.geolocation.data.geoplugin_city.toString().replace(' ', '-')
      let state = this.$store.state.geolocation.data.geoplugin_regionName.toString().replace(' ', '-')
      let country = this.$store.state.geolocation.data.geoplugin_countryName.toString().replace(' ', '-')
      let location = city + '--' + state + '--' + country
      this.$axios.get(`/jobs/recent/${location}?domain=${domain}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (response.statusText === 'No Content') {
          clearInterval(this.interval) // stop calling when no listing available to display
          let lang = this.$store.getters['user/getCurrentLanguage']
          let path = `/jobs/recent/${location}?domain=${domain}`
          bugsnagClient.notify(new Error('Unavailable to obtain listings in location: ' + location), {
            beforeSend: function (report) {
              report.metaData = {
                accountInfo: {
                  language: lang,
                  API: path
                }
              }
            }
          })
        }
        this.popup_content = response.data.jobsInfo.content
        this.popup_avatar = response.data.jobsInfo.avatar
        this.popup_show = true
        // custom notification
        this.$notify({
          group: 'custom-template',
          title: this.popup_content,
          duration: 12000
        })
      }).catch(error => {
        console.log(error)
        let lang = this.$store.getters['user/getCurrentLanguage']
        let path = `/jobs/recent/${location}?domain=${domain}`
        bugsnagClient.notify(new Error('Error on obtaining listings in location: ' + location), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang,
                API: path
              }
            }
          }
        })
      })
    },
    checkLanguage () {
      let currentLanguage = this.$store.getters['user/getCurrentLanguage']
      switch (currentLanguage) {
        case 'zh_tw': return 'www.petbacker.com.tw'
        case 'zh_cn': return 'zh.petbacker.com'
        case 'zh_hk': return 'www.petbacker.hk'
        case 'dede': return 'www.petbacker.de'
        case 'jajp': return 'www.petbacker.jp'
        case 'cscz': return 'www.petbacker.cz'
        case 'frfr': return 'www.petbacker.fr'
        case 'sksk': return 'sk.petbacker.com'
        case 'eses': return 'www.petbacker.es'
        case 'itit': return 'www.petbacker.it'
        case 'thth': return 'th.petbacker.com'
        //  case 'ptpt': return 'www.petbacker.com.br'
        default: return 'www.petbacker.com'
      }
    },
    markRequestComplete (serviceUserID) {
      let responseInfo = JSON.stringify({
        'responseInfo': {
          'acceptanceStatus': this.STATUS.ACCEPTANCE_PARENT_ACCEPT,
          'completionStatus': this.STATUS.COMPLETION_PARENT_DEEMED_COMPLETE
        }
      })
      this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`, responseInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('booking.mark.complete'),
          type: 'positive'
        })
        this.$router.push({ name: 'ReviewVerified', params: {request: this.$route.params.request, response: this.$route.params.response} })
      }).catch(e => {
        console.log(e)
        let lang = this.$store.getters['user/getCurrentLanguage']
        let path = `users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}`
        bugsnagClient.notify(new Error(e), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang,
                API: path
              }
            }
          }
        })
        this.$q.notify({
          message: this.$t('booking.mark.fail'),
          type: 'negative'
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.popup
  background-color: white
  min-width: 320px
  padding: 5px 7px
  position: fixed
  bottom: 20px;
  right: 20px;
  z-index: 99999999;
  color: #000
  border: 1px grey
  box-shadow: 3px 3px 3px 3px #a5a2a2
  border-left: 4px solid #644b8e
.popup_text
  display: block
  text-align: left
  margin-right: 20px
  padding-left: 80px
  width: 300px
  font-size: 14px
.popup_image
  float:left
  display: inline-block
  max-width: 20%
  height: auto

.request-card-position
  position: absolute
  top: 160px
  display: block

@media only screen and (min-width: 320px)
  .request-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 4%

@media only screen and (min-width: 350px)
  .request-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 9%

@media only screen and (min-width: 370px)
  .request-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 11%

@media only screen and (min-width: 410px)
  .request-card-position
    position: absolute
    top: 125px
    display: block
    margin-left: 14%

@media only screen and (min-width: 500px)
  .request-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 20%

@media only screen and (min-width: 750px)
  .request-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 33%

@media only screen and (min-width: 1024px)
  .request-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 35%

@media only screen and (min-width: 1300px)
  .request-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 35%

@media only screen and (min-width: 1600px)
  .request-card-position
    position: absolute
    top: 120px
    display: block
    margin-left: 36%
</style>

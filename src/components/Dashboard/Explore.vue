<template>
    <q-page>
      <q-pull-to-refresh @refresh="refreshExplorePage">
        <!-- Carousel images -->
        <q-carousel swipeable keep-alive :keep-alive-max="3" color="white" class="carousel-container" navigation animated v-model="slide" autoplay infinite transition-prev="slide-right" transition-next="slide-left">
          <q-carousel-slide draggable="false" v-for="(banner, index) in $store.getters['banners/getExploreBanners']" :key="index" :name="index + 1" style="padding:0px;" @click="handleBannerClick(banner)">
            <q-img class="carousel-container image-upload" basic height="190px" width="100%" placeholder-src="statics/images/graphic-placeholder.jpg" :src="(screenWidth < 650) ?  banner.media_filename : banner.media_filename_desktop" style="margin: none;" :alt="banner.title"></q-img>
          </q-carousel-slide>
        </q-carousel>

        <!-- Center Card Money & Points -->
        <q-card style="border-radius: 10px;" class="q-mx-lg card-position">
          <q-item class="q-pa-sm" clickable>
              <q-item-section @click="goTo('AccountHistory')">
                  <q-item class="q-py-none" dense>
                      <q-item-section thumbnail class="q-px-md">
                        <q-icon name="fas fa-money-bill-wave" color="yellow" />
                      </q-item-section>
                      <q-item-section v-if="$store.getters['cached/getTransactionHistory']">{{getCurrency($store.getters['cached/getTransactionHistory'].currencyId)}} {{formatDigits($store.getters['cached/getTransactionHistory'].balance)}}</q-item-section>
                      <q-item-section v-else-if="$store.getters['user/getUserUuidState'] === null">{{getCurrency($store.getters['user/getUserMobileCountryId'] ? $store.getters['user/getUserMobileCountryId'] : '234')}} 0</q-item-section>
                      <q-item-section v-else><q-spinner-dots size="md"></q-spinner-dots></q-item-section>
                  </q-item>
                  <q-item class="q-px-none q-py-none" dense>
                    <q-item-section class="text-grey q-pl-sm" style="line-height: 1.3em;font-size: 11px;">{{$t('cashback.every.fifth.booking')}}</q-item-section>
                    <!-- <q-item-section class="text-grey q-pl-sm" style="line-height: 1em;font-size: 12px;">{{$t('get.rebates.in.points.every.booking')}}</q-item-section> -->
                  </q-item>
              </q-item-section>

              <q-separator vertical inset class="q-ma-sm" />

              <q-item-section @click="goTo('Referrals')">
                  <!-- <q-item class="q-py-none" dense>
                      <q-item-section thumbnail class="q-px-md">
                          <q-icon name="fas fa-coins" color="yellow" />
                      </q-item-section>
                      <q-item-section>50 points</q-item-section>
                  </q-item>
                  <q-item class="q-px-none q-py-none" dense>
                      <q-item-section class="text-grey q-pl-sm" style="line-height: 1em;font-size: 12px;">Share the app or book to earn points</q-item-section>
                  </q-item> -->
                  <q-item class="q-px-none q-py-none" dense>
                    <q-item-section class="text-grey q-pl-sm" style="line-height: 1.5em;font-size: 12px;">{{$t('tap.here.start.earning')}}</q-item-section>
                    <!-- <q-item-section class="text-grey q-pl-sm" style="line-height: 1em;font-size: 12px;">Share the app or book to earn points</q-item-section> -->
                  </q-item>
              </q-item-section>
              <!-- <q-item-section @click="$router.push({name: 'Rewards'})">
                  <q-item class="q-py-none" dense>
                      <q-item-section thumbnail class="q-px-md">
                          <q-icon name="fas fa-coins" color="yellow" />
                      </q-item-section>
                      <q-item-section>{{$store.getters['user/getPoints']}} points</q-item-section>
                  </q-item>
                  <q-item class="q-px-none q-py-none" dense>
                      <q-item-section class="text-grey q-pl-sm" style="line-height: 1em;font-size: 12px;">Share the app or book to earn points</q-item-section>
                  </q-item>
                  <q-item class="q-px-none q-py-none" dense>
                    <q-item-section class="text-grey q-pl-sm" style="line-height: 1.5em;font-size: 12px;">{{$t('get.extra.earnings.from.referrals')}} <br/>{{$t('tap.here.start.earning')}}</q-item-section>
                  </q-item>
              </q-item-section> -->
          </q-item>
        </q-card>

        <!-- Services Icons -->
        <q-list class="justify-center row q-mt-xl q-pt-lg mt-xxl" v-if="services">
            <!-- Services -->
            <div class="text-center col-xs-3 col-md-3" v-for="index in 7" :key="index" @click="$router.push({name: 'BackersNearby', query: {category_id: services[index - 1].id}})">
                <img v-if="services[index - 1]" :src="services[index - 1].icon" height="55px" width="55px" :alt="services[index - 1].name" loading="lazy" decoding="async" />
                <p style="font-size: 13px;" v-if="services[index - 1]">{{$t(services[index - 1].shortName)}}</p>
            </div>
            <div class="text-center col-xs-3 col-md-3" @click="goTo('Services')">
                <img src="statics/images/service-icons/services-more.png" height="55px" width="55px" loading="lazy" decoding="async" alt="More Services" />
                <p style="font-size: 13px;">{{ $t('more') }}</p>
            </div>
        </q-list>
      </q-pull-to-refresh>

        <div class="q-mt-md">
             <!-- Backers nearby -->
              <h6 class="q-px-md q-mb-md q-mt-sm">
                {{$t('backers.nearby')}}
                <div class="float-right q-my-none text-primary" style="font-weight: 400;font-size: 14px;" @click="$router.push({name: 'BackersNearby', query: {cached: listingInfo && listingInfo.length > 6 ? 1 : 0}})">
                  {{$t('see.more')}}<q-icon name="chevron_right" size="16px;"></q-icon>
                </div>
              </h6>
              <div class="row no-wrap q-px-sm justify-left hide-scrollbar explorePage" style="height: 230px;overflow: auto;" >
                <!-- Listing Cards-->
                <listing-card class="col-12 q-ml-sm backer-listing" style="height: 222px;" v-for="(listing, index) in listingInfo" :key="index" :listingInfo="listing" :isFavorite="listing.isFavorite" :index="index" @on-favorite="updateFavorite" @on-block-user="onBlockUser"></listing-card>

                <!-- View More -->
                <q-card class="col-4 q-mr-sm bg-primary clickable q-ml-sm" style="max-height: 147px;border-radius: 11px;" flat bordered @click="$router.push({name: 'BackersNearby', query: {cached: 1}})">
                    <!-- Content -->
                    <q-card-section class="q-pa-none text-center">
                      <h6 class="text-white" style="margin-top: 40%;">{{$t('see.more')}}</h6>
                    </q-card-section>
                </q-card>
              </div>

              <!-- Pets In Community -->
              <h6 class="q-px-md q-my-md" v-if="petsInfo && petsInfo.length > 0">
                {{$t('pets.in.community')}}
                <div class="float-right q-my-none text-primary" style="font-weight: 400;font-size: 14px;" @click="$router.push({name: 'PetsInCommunity'})">
                 {{$t('see.more')}}<q-icon name="chevron_right" size="16px;"></q-icon>
                </div>
              </h6>
              <div class="row no-wrap q-px-sm justify-left hide-scrollbar" v-if="petsInfo && petsInfo.length > 0" style="height: 223px;overflow: auto;">
                <!-- Pet Cards-->
                <pet-card class="col-12 q-ml-sm" style="width: 155px;height: 223px;" v-for="(pet, index) in petsInfo" @on-like="onLikePost" @on-unlike="onUnlikePost" :index="index" :key="index" :petInfo="pet" @on-block-moment="onBlockMoment"></pet-card>

                <!-- View More -->
                <q-card class="col-4 q-mr-sm bg-primary q-ml-sm" flat bordered style="max-height: 175px;border-radius: 11px;" @click="$router.push({name: 'PetsInCommunity'})">
                    <!-- Content -->
                    <q-card-section class="q-pa-none text-center">
                        <h6 class="text-white" style="margin-top: 50%;">{{$t('see.more')}}</h6>
                    </q-card-section>
                </q-card>
              </div>

              <!-- Join us and be a pet sitter -->
              <div class="q-my-xl" v-if="!$store.getters['user/getServiceProvider']">
                <q-card class="q-mx-md bg-secondary" flat style="border-radius: 11px;height: 400px;">
                  <q-card-section class="text-center text-white">
                    <h6 class="q-my-sm font-medium">{{$t('become.a.sitter')}}</h6>
                    <p class="q-my-none font-normal q-px-lg">{{$t('become.a.sitter.earn.extra')}}</p>
                    <q-btn rounded color="white" class="text-black text-capitalize q-my-md q-px-lg" @click="goTo('OfferService')">{{$t('chat.learnmore')}}</q-btn>
                  </q-card-section>

                  <!-- Image -->
                  <q-img src="statics/images/pet_sitter.jpeg" placeholder-src="statics/images/pet_sitter.jpeg" basic class="image-upload" height="230px"></q-img>
                </q-card>
              </div>
              <br/>

               <!-- Blogs -->
              <h6 class="q-px-md q-my-md" v-if="$store.getters['cached/getBlogCached'] && $store.getters['cached/getBlogCached'].length > 0">
                {{$t('blogs')}}
                <div class="float-right q-my-none text-primary" style="font-weight: 400;font-size: 14px;" @click="$router.push({name: 'Blogs'})">
                  {{$t('see.more')}}<q-icon name="chevron_right" size="16px;"></q-icon>
                </div>
              </h6>
              <div v-if="$store.getters['cached/getBlogCached'] && $store.getters['cached/getBlogCached'].length > 0" class="row no-wrap q-px-md justify-left hide-scrollbar" style="height: 147px;overflow: auto;">
                <!-- Blog Cards-->
                <blog-card class="col-12 q-mr-sm" style="heigth: 147px;" v-for="(blog, index) in $store.getters['cached/getBlogCached']" :key="index" :blogInfo="blog"></blog-card>

                <!-- VIEW MORE BLOGS -->
                <q-card class="col-6 q-mr-md bg-primary" flat bordered style="border-radius: 11px;height: 145px;" @click="$router.push({name: 'Blogs'})">
                    <!-- Content -->
                    <q-card-section class="q-pa-none text-center">
                        <h6 class="text-white" style="padding-top:3%;">{{$t('view.more')}}</h6>
                    </q-card-section>
                </q-card>
              </div>

              <!-- Dog Walking -->
              <div class="q-my-xl">
                <q-card class="q-mx-md bg-primary" flat style="border-radius: 11px;height: 180px;" @click="$emit('trigger-dialog-pet-walk', true)">
                  <!-- Image -->
                  <q-img src="statics/images/pet_walking_bottom_banner.png" placeholder-src="statics/images/pet_walking_bottom_banner.png" basic :height="$store.getters['user/getCurrentLanguage'] === 'frfr' ? '210px' : '180px'" class="image-upload">
                    <h6 v-if="$store.getters['user/getCurrentLanguage'] === 'frfr'" class="text-left text-grey-9 q-my-none q-pa-sm text-weight-bold" style="padding-right:37%;">{{$t('petbacker.walk.with.your.pets')}}</h6>
                    <h5 v-if="$store.getters['user/getCurrentLanguage'] !== 'frfr'" class="text-left text-grey-9 q-my-none q-pa-sm text-weight-bold" style="padding-right:37%;">{{$t('petbacker.walk.with.your.pets')}}</h5>
                  </q-img>
                </q-card>
              </div>
        </div>

        <!-- Stayed Informed -->
        <div class="bg-grey-3 q-pa-xs" style="height: 450px;" v-if="$store.getters['user/getCurrentLanguage'] === 'en'">
          <h6 class="q-px-md q-my-lg">{{$t('stay.informed')}}</h6>
          <explore-footer-articles class="justify-left"  style="height: 330px;"></explore-footer-articles>
        </div>
        <p v-else class="q-py-md"></p>

      <!-- More Services Dialog -->
      <dialog-services :trigger="servicesModal" @on-close="triggerServicesModal"></dialog-services>

      <!-- Future Updates Dialog -->
      <dialog-future-update :trigger="futureUpdateModal" :message="$t('dog.walking.better.experience')" @on-close="onCloseFutureUpdateModal"></dialog-future-update>
    </q-page>
</template>
<script>
import servicesAvailable from 'assets/services.json'
import countries from 'assets/countries.json'
const getLanguage = () => import('assets/languages.json')
import { throttle } from 'quasar'

export default {
  components: {
    'listing-card': () => import('components/Explore/listingCards.vue'),
    'pet-card': () => import('components/Explore/petCards.vue'),
    'blog-card': () => import('components/Explore/blogCards.vue'),
    'dialog-future-update': () => import('components/DialogFutureUpdate.vue'),
    'dialog-services': () => import('components/DialogServices.vue'),
    'explore-footer-articles': () => import('components/Explore/articles.vue')
  },
  data () {
    return {
      slide: 1,
      services: servicesAvailable,
      listingInfo: [{}, {}, {}, {}, {}, {}],
      petsInfo: [],
      currentLocation: {
        latitude: null,
        longitude: null
      },
      futureUpdateModal: false,
      servicesModal: false,
      screenWidth: screen.width,
      renewCache: false
    }
  },
  preFetch ({store}) {
    // update message inbox tab to allow better UX flow
    // user clicking to inbox from here expects to see jobs inbox
    store.commit('user/updateMessageTabIndexState', 'tab-notifications')
  },
  created () {
    document.addEventListener('pause', this.onPause, false)
    if (this.$q.platform.is.cordova) {
      this.getCurrentLocation()
      // Conditoanlly check if location is null, if null trigger to get location forcefully
      if (this.currentLocation.longitude === null || this.currentLocation.latitude === null) {
        console.log('Location not recorded triggered')
        this.currentLocation.longitude = this.$store.getters['geolocation/geopluginLongitude']
        this.currentLocation.latitude = this.$store.getters['geolocation/geopluginLatitude']
        console.log('Location function triggered again')
      }
      document.addEventListener('deviceready', this.onDeviceReady, false)
      this.getFromCache()
      this.getBackersNearby()
      this.getBannerInfo(true)
      this.getPetsInCommunity()
    } else {
      this.getFromCache()
      this.getBackersNearby()
      this.getBannerInfo()
      this.getPetsInCommunity()
      this.getBlogs()
    }
    this.getAccountInfo = throttle(this.getAccountInfo, 28000)
    this.getAccountInfo()

    this.currentLocation.latitude = this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude']
    this.currentLocation.longitude = this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude']
  },

  activated () {
    window.scrollTo(0, 0)

    setTimeout(() => { this.getFromCache() }, 0)
  },
  deactivated () {
    setTimeout(() => { this.getAccountInfo() }, 100)
  },
  beforeDestroy () {
    document.removeEventListener('deviceready', this.onDeviceReady)
    document.removeEventListener('pause', this.onPause, false)
  },
  methods: {
    onPause (event) {
      // Handle the pause event (e.g., when the app is sent to the background)
      console.log('App paused')
      this.sendImpression('App Moved to background', 'Auth Flow')
      // You can perform actions when the app is paused
    },
    onDeviceReady () {
      this.getCurrentLocation()
    },
    onUnlikePost (index) {
      this.petsInfo[index].totalLikes = `${parseInt(this.petsInfo[index].totalLikes) - 1}`
      this.petsInfo[index].isLiked = 0
    },
    onLikePost (index) {
      this.petsInfo[index].totalLikes = `${parseInt(this.petsInfo[index].totalLikes) + 1}`
      this.petsInfo[index].isLiked = 1
    },
    triggerServicesModal (status) {
      this.servicesModal = status
    },
    goTo (routeName) {
      if (routeName === 'Services') {
        this.triggerServicesModal(true)
        return
      }

      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', true, routeName)
        return
      }

      if (routeName === 'OfferService') {
        this.sendImpression('Button Click', 'Learn More - Explore', 'Become a Sitter')
        this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
        this.$route.query.createListing = 1
        return
      }

      this.$router.push({name: routeName})
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
    getFromCache () {
      if (this.$store.getters['cached/getBackersNearbyCached']) {
        this.listingInfo = this.$store.getters['cached/getBackersNearbyCached']
        setTimeout(() => {
          this.$emit('on-loaded', false)
        }, 2800)
      }

      if (this.$store.getters['cached/getPetsInCommunityCached']) {
        this.petsInfo = this.$store.getters['cached/getPetsInCommunityCached']
      }

      if (!this.$store.getters['cached/getBlogCached']) {
        this.getBlogs()
      }
    },
    cacheMoments () {
      if ((this.$store.getters['cached/getMomentsPublicCached'] && this.$store.getters['cached/getMomentsRelatedCached'])) {
        return
      }

      // cache public moments
      this.$axios.get(`moments?refresh=1&type=0&auth=0`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$store.dispatch('cached/cacheMomentsPublic', response.data)
      }).catch((error) => {
        console.error(error)
      })

      if (this.$store.getters['user/getUserUuidState'] === null) {
        return
      }

      // cache related moments
      this.$axios.get(`moments?refresh=1&type=3`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$store.dispatch('cached/cacheMomentsRelated', response.data)
      }).catch((error) => {
        console.error(error)
      })
    },
    onCloseFutureUpdateModal (status) {
      this.futureUpdateModal = status
    },
    getCurrency (id) {
      return this.$_.findWhere(countries, {'id': id.toString()}).currencyCode
    },
    refreshExplorePage (done) {
      this.getCurrentLocation()
      this.getBannerInfo(true)
      this.getBackersNearby()
      this.getPetsInCommunity()
      this.getBlogs()
      setTimeout(() => {
        done()
      }, 2000)
    },
    getCurrentLocation () {
      const fetchAndCompareLocation = (module) => {
        this.$store.dispatch(`${module}/cacheGeoLocation`).then((position) => {
          console.log('Fetched position from cacheGeoLocation:', position)
          if (position.longitude !== this.$store.getters[`${module}/getUserLongitude`] ||
          position.latitude !== this.$store.getters[`${module}/getUserLatitude`]) {
            console.log('Using dispatched position:', position)
            this.currentLocation.latitude = position.latitude
            this.currentLocation.longitude = position.longitude
          } else {
            console.log('Using latitude and longitude from the store')
            this.currentLocation.latitude = this.$store.getters[`${module}/getUserLatitude`]
            this.currentLocation.longitude = this.$store.getters[`${module}/getUserLongitude`]
          }
        }).catch((error) => {
          console.error('Dispatch failed:', error)
          console.log('Using latitude and longitude from the store')
          this.currentLocation.latitude = this.$store.getters[`${module}/getUserLatitude`]
          this.currentLocation.longitude = this.$store.getters[`${module}/getUserLongitude`]
        })
      }

      if (this.$q.platform.is.cordova) {
        console.log('Running on Cordova')
        fetchAndCompareLocation('user')
      } else {
        console.log('Running on non-Cordova platform')
        if (this.$q.cookies.get('hideLocationPrompt')) {
          console.log('Location prompt is hidden')
          return
        }
        fetchAndCompareLocation('geolocation')
      }
    },
    getBannerInfo (languageChanged = false) {
      if (!this.$store.getters['banners/getExploreBanners'] || languageChanged) {
        // dynamic import languages only when needed
        getLanguage().then((languages) => {
          // get from api
          this.$axios.get(`banners?mobile=${this.$q.platform.is.mobile ? '1' : '0'}&language_id=${this.$_.findWhere(languages, {'value': this.$store.getters['user/getCurrentLanguage']}).id}&country_id=${this.$store.getters['user/getUserMobileCountryId'] ? this.$store.getters['user/getUserMobileCountryId'] : '234'}`
          ).then(response => {
            this.$store.dispatch('banners/cacheExploreBanners', response.data.bannerInfo)
          }).catch(error => {
            console.error(error)
          })
        })
      }
    },
    updateFavorite (status, index) {
      this.listingInfo[index].isFavorite = status
      this.$store.dispatch('cached/cacheBackersNearby', this.listingInfo)
    },
    getBackersNearby () {
      console.log('check the location going in endpoint', this.currentLocation.latitude)
      console.log('check the location going in endpoint', this.currentLocation.longitude)
      this.$axios.get(`listings/search?per-page=8&page=1&lang=${this.langToAPI(this.$store.getters['user/getCurrentLanguage'])}&lon=${this.currentLocation.longitude}&lat=${this.currentLocation.latitude}${this.renewCache ? `&renewCache=1` : ''}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.data && response.data.searchInfo.items.serviceInfo.length > 0) {
          this.listingInfo = response.data.searchInfo.items.serviceInfo

          if (JSON.stringify(this.$store.getters['cached/getBackersNearbyCached']) !== JSON.stringify(response.data.searchInfo.items.serviceInfo)) {
            this.$store.dispatch('cached/cacheBackersNearby', response.data.searchInfo.items.serviceInfo)
          }
          if (this.renewCache) {
            this.renewCache = false
            this.$store.dispatch('cached/cacheBackersNearby', response.data.searchInfo.items.serviceInfo)
          }
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        setTimeout(() => {
          this.$emit('on-loaded', false)
        }, 700)
      })
    },
    getPetsInCommunity () {
      this.$axios.get(`users/walls?page=1&per_page=8&countryid=${this.$store.getters['user/getUserMobileCountryId'] ? this.$store.getters['user/getUserMobileCountryId'] : '234'}`
      ).then((response) => {
        this.petsInfo = response.data.wallInfo.items

        if (JSON.stringify(this.$store.getters['cached/getPetsInCommunityCached']) !== JSON.stringify(response.data.wallInfo.items)) {
          this.$store.dispatch('cached/cachePetsInCommunity', response.data.wallInfo.items)
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.getBlogs()
      })
    },
    async getBlogs () {
      let blogDomain = 'https://www.petbacker.com'
      if (this.$store.getters['user/getCurrentLanguage'] === 'zh_tw' || this.$store.getters['user/getCurrentLanguage'] === 'zh_hk' || this.$store.getters['user/getCurrentLanguage'] === 'zh_cn') {
        blogDomain = 'https://www.petbacker.com.tw'
      }

      this.$axios({method: 'get', baseURL: `${blogDomain}`, url: `/blog/api/get/content/articles?limit=7&orderby=created&orderdir=desc&api_key=QG17246Q7Z2XZ2JS09UH`}
      ).then((response) => {
        this.$store.dispatch('cached/cacheBlogs', response.data.articles)
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.cacheMoments()
      })
    },
    async getAccountInfo () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        return
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/accountstatement?per-page=20&page=1`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$store.dispatch('cached/cacheTransactionHistory', response.data.accountStatementInfo)
      }).catch((error) => {
        console.log(error)
      }).finally(_ => {
        this.onRefresh = false
      })
    },
    onBlockMoment () {
      this.getPetsInCommunity()
    },
    onBlockUser () {
      this.renewCache = true
      this.getBackersNearby()
    },
    handleBannerClick (banner) {
      const uuid = this.$store.getters['user/getUserUuidState']
      const uuidParam = `uuid=${uuid}`

      banner.url += banner.url.includes('?') ? `&${uuidParam}` : `?${uuidParam}`
      banner.androidUrl += banner.androidUrl.includes('?') ? `&${uuidParam}` : `?${uuidParam}`

      const platformUrl = this.$q.platform.is.ios ? banner.url : banner.androidUrl
      this.openUrl(platformUrl)
    }
  }
}
</script>
<style lang="stylus">
.card-position
  position: absolute
  top: 160px
  display: block
  margin-left: 12%

@media only screen and (min-width: 320px)
  .card-position
    position: absolute
    top: 165px
    display: block
    margin-left: 6%
  .explorePage .backer-listing
    width: 128px !important
  .explorePage .listing-image
    width: 126px !important

@media only screen and (min-width: 350px)
  .card-position
    position: absolute
    top: 165px
    display: block
    margin-left: 6.5%
  .explorePage .backer-listing
    width: 154px !important
  .explorePage .listing-image
    width: 152px !important

@media only screen and (min-width: 370px)
  .card-position
    position: absolute
    top: 165px
    display: block
    margin-left: 7%

@media only screen and (min-width: 410px)
  .card-position
    position: absolute
    top: 165px
    display: block
    margin-left: 6%

@media only screen and (min-width: 500px)
  .card-position
    position: absolute
    top: 170px
    display: block
    margin-left: 8%

@media only screen and (min-width: 800px)
  .card-position
    position: absolute
    top: 170px
    display: block
    margin-left: 20%

div.carousel-container
  padding: 0px
  height: 190px

.frfr .mt-xxl
  margin-top: 76px
</style>

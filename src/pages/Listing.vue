<template>
  <div>
    <q-scroll-observer @scroll="onScroll"></q-scroll-observer>
    <q-page class="q-mb-xl margin-auto" :style="{'max-width': $q.platform.is.mobile ? '100%' : '1030px'}">
        <q-tabs v-model="tab" ref="listing-header" class="text-grey fixed-top bg-white" style="border-bottom: solid 1px lightgrey;z-index:1000;" active-color="primary" indicator-color="primary" align="justify" dense>
          <q-tab name="details" :label="$t('details')" class="text-capitalize"></q-tab>
          <q-tab name="reviews" :label="reviewInfo && reviewInfo.reviewCount > 0 ? `${reviewInfo.reviewCount} ${$t('reviews.title')}` : $t('reviews.title')" class="text-capitalize"></q-tab>
        </q-tabs>

        <!-- <div v-if="showEdit" style="margin-top: 8.5%;">
          <q-btn outline color="primary" class="full-width" label="Edit Listing" :ripple="false" @click="$router.push({name: 'EditListing', params: {listingId: $route.params.listingId}})"></q-btn>
        </div> -->
        <p style="margin-top: 7%;"></p>

        <q-tab-panels v-model="tab" animated keep-alive ref="listing-tabs">
          <q-tab-panel name="details" class="q-pa-none">
            <!-- Carousel Header Image -->
            <carousel-header :carouselImages="images" :images="serviceImages"></carousel-header>

            <!-- About Listing -->
            <div class="q-mx-md" >
              <q-item v-if="listingInfo" dense class="q-mt-sm q-mb-md q-pl-xs" clickable @click="$router.push({name: 'PublicProfile', params: {userId: $route.query.id}})">
                <q-item-section avatar>
                  <q-avatar style="height: 70px; width: 70px;">
                      <img :src="userInfo.avatarImage" class="image-upload">
                  </q-avatar>
                </q-item-section>

                <q-item-section class="q-my-sm">
                  <q-item-label lines="1">
                    <h6 class="q-my-none text-left" style="font-size: 17px;line-height: 1.2em;">{{listingInfo.listingName}}</h6>
                  </q-item-label>

                  <q-item-label class="q-my-sm text-grey" style="font-size: 11px;">
                    <q-icon name="fas fa-star" style="font-size: 12px;" class="star-color q-mr-xs" v-for="i in listingInfo.serviceReviewsInfo.rating" :key="i"></q-icon>
                    <span v-if="reviewInfo && reviewInfo.reviewCount > 1">({{reviewInfo.reviewCount}})</span>
                  </q-item-label>

                  <q-item-label>
                    <q-btn :label="$t('view.profile')" class="full-width" size="sm" dense color="primary"></q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense class="q-mt-sm q-mb-md q-pl-xs" v-else>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" style="height: 70px; width: 70px;"></q-skeleton>
                </q-item-section>

                <q-item-section class="q-mb-md q-mt-sm">
                  <q-item-label><q-skeleton class="q-my-sm" width="150px"></q-skeleton></q-item-label>
                  <q-item-label><q-skeleton width="190px"></q-skeleton></q-item-label>
                </q-item-section>
              </q-item>

              <!-- Badges Section -->
              <div class="justify-evenly">
                <badges-section :userInfo="userInfo"></badges-section>
              </div>

              <q-separator class="q-my-md" ></q-separator>

              <div class="q-mx-sm font-normal" style="max-width: 100%;" v-html="descriptionHtml" v-if="descriptionHtml"></div>
              <div class="col-xs-12 text-center" v-else>
                <ComponentPreLoader></ComponentPreLoader>
              </div>
            </div>
            <!-- {{descriptionHtml}} -->
            <q-separator inset class="q-my-md" ></q-separator>

            <!-- Resident Pets -->
            <div class="q-mx-md" v-if="userInfo && userInfo.personalItemsInfo.items.length > 0">
                <h6 class="q-my-md q-ml-sm">{{$t('resident.pets')}}</h6>
                <div class="row justify-evenly">
                    <q-card class="col-xs-5 q-mb-sm resident-pets" v-for="pet in userInfo.personalItemsInfo.items" :key="pet.id" @click="$router.push({name: 'PetProfile', params: {petId: pet.id}})">
                        <img :src="pet.images[0]" class="image-upload" style="height: 155px;max-height: 155px;"/>

                        <q-card-section class="text-center q-pa-xs">
                            <p class="q-my-none">{{pet.personalItemDetails[0].content}}</p>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <q-separator inset class="q-my-md" v-if="userInfo && userInfo.personalItemsInfo.items.length > 0"/>

            <!-- Neighbourhood -->
            <div class="q-mx-md" v-if="userInfo && listingInfo">
              <h6 class="q-my-md q-ml-sm">{{$t('neighbourhood')}}</h6>
              <p class="q-mx-sm font-small">{{$t('backer.service.nearby', {backerName: userInfo.username, serviceType: $t(getServiceName(listingInfo.subServiceId[0]))})}} <strong>{{listingInfo.serviceLocation[0].city}}, {{listingInfo.serviceLocation[0].country}}</strong>. {{$t('book.via.petbacker')}}</p>
              <div style="position: relative;">
                <!-- <img :src="`https://www.google.com/maps/api/staticmap?size=${deviceWidth - 30}x310&zoom=13&center=${this.listingInfo.serviceLocation[0].latitude},${this.listingInfo.serviceLocation[0].longitude}&markers=icon:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png%7C${this.listingInfo.serviceLocation[0].latitude},${this.listingInfo.serviceLocation[0].longitude}&key=${PROCESS.GOOGLE_MAPS_KEY}`" /> -->
                <!-- <q-icon name="img:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png" style="position: absolute;width: 150px;height: 150px;left: 30%;top: 20%;"></q-icon> -->
                <iframe
                  sandbox="allow-same-origin allow-pointer-lock allow-scripts"
                  :width="(deviceWidth - 30)"
                  scrolling="no"
                  height="250"
                  frameborder="0"
                  allowtransparency="true"
                  style="border:0;"
                  :src="`https://www.google.com/maps/embed/v1/view?center=${listingInfo.serviceLocation[0].latitude},${listingInfo.serviceLocation[0].longitude}&zoom=13&key=${PROCESS.GOOGLE_MAPS_KEY}`"
                >
                </iframe>
              </div>
            </div>

            <q-separator inset class="q-my-md"/>

            <!-- Payment Protection -->
            <div class="q-mb-md q-mt-lg q-mb-xl q-mx-lg" v-if="!showEdit">
              <h6 class="q-my-xs">{{$t('payment.methods')}}</h6>
              <img src="statics/images/donate-now-payment.png" style="height: auto;width: 100%;" class="row q-mb-md" />
              <!-- <q-btn  outline color="primary" class="full-width" style="border-radius: 11px;" label="Contact Backer" @click="contactNowModal = true"></q-btn> -->
              <q-item dense class="q-pa-none q-mt-md">
                <q-item-section>
                  <q-item-label caption>{{$t('book.via.petbacker.long')}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="fas fa-shield-alt" color="primary"></q-icon>
                </q-item-section>
              </q-item>
            </div>

          <!-- Other services by this user -->
          <div class="q-my-md q-mt-lg q-mb-lg" :class="{'q-mb-xl q-pb-lg': showEdit}" v-if="listingInfo && listingInfo.otherListingInfo.length > 0">
            <h6 class="q-my-none q-mx-md q-px-sm">{{$t('other.services.by.backer', {backerName: userInfo.username})}}</h6>
            <q-scroll-area :thumb-style="{ opacity: 0 }"  class="justify-left" style="height: 13vh;" horizontal>
              <div class="row no-wrap q-py-sm">
                <p class="q-pl-md"></p>

                <!-- Other listing card -->
                <q-card v-for="(listing, index) in listingInfo.otherListingInfo" :key="index" @click="$router.push({name: 'Listing', params: {listingId: listing.id}, query: {id: userInfo.id, url: listing.listing_url}})" class="col q-mx-sm bg-white clickable" style="width: 230px;">
                  <q-card-section class="q-pa-sm">
                    <q-item dense class="q-pa-none">
                      <q-item-section thumbnail class="q-pl-md">
                        <q-avatar style="height:55px; width: 55px; max-width: 55px;">
                          <img :src="listing.thumbnail" class="image-upload"/>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label v-if="listing.name" lines="2">{{listing.name}}</q-item-label>
                        <q-item-label v-if="listing.parent_service_id" caption>{{$t(getParentServiceName(listing.parent_service_id))}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
                <p class="q-pr-md"></p>
              </div>
            </q-scroll-area>
          </div>

          <!-- Similar listings in this area -->
          <div class="q-my-lg q-mb-xl q-pb-lg" v-if="otherListingInfo && !showEdit">
            <h6 class="q-my-none q-mx-md q-px-sm" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-if="listingInfo">{{$t('similar.listings', {cityName: listingInfo.serviceLocation[0].city})}}</h6>
            <q-infinite-scroll @load="onLoad" class="row q-py-sm justify-around q-mx-md" ref="infinite-scroll" :offset="2500">
                <div v-for="(listing, index) in otherListingInfo" :key="index" :class="listing.parentServiceName === '1' ? 'col-xs-12' : 'col-md-3 col-xs-6'">
                  <!-- Broadcast image -->
                  <q-card class="broadcast-image" style="max-height: 145px;margin-bottom: 10%;" v-if="listing.parentServiceName === '1'" @click="triggerServicesModal(true)" flat bordered>
                    <q-img :src="listing.coverImage" style="height: 145px;" class="image-offset"></q-img>
                  </q-card>

                  <!-- Listing card -->
                  <listing-card :listingInfo="listing" :index="index" :currentListing="listingInfo.id" class="backer-listing q-px-xs" v-else></listing-card>
                </div>
                <template v-slot:loading v-if="!endOfPage">
                  <div class="row">
                    <listing-card v-for="index in 8" :key="index" :listingInfo="{}" :index="index" class="backer-listing col-md-3 col-xs-6 q-px-xs"></listing-card>
                  </div>
                </template>
            </q-infinite-scroll>
          </div>
          </q-tab-panel>

          <q-tab-panel name="reviews" class="q-pa-none q-pt-sm">
            <!-- Reviews -->
            <div v-if="reviewInfo && listingInfo && listingInfo.serviceReviewsInfo.items.length > 0" class="q-mb-xl q-pb-lg">
              <review-card v-for="index in reviewInfo.reviewCount" :key="index" :showReply="showEdit" :reviewInfo="reviewInfo" :index="index"></review-card>
            </div>
            <div class="col-xs-12 text-center" v-else-if="listingInfo && listingInfo.serviceReviewsInfo.items.length === 0">
              <img class="image-upload q-mt-md" :src="'statics/images/no_notification.png'" width="60%"/>
              <p class="text-center q-mt-md text-label font-normal" v-html="$t('listing.empty.reviews')"></p>
            </div>
            <div class="col-xs-12 text-center" v-else-if="listingInfo && listingInfo.serviceReviewsInfo.items.length !== 0 && reviewInfo === null">
              <ComponentPreLoader></ComponentPreLoader>
            </div>
          </q-tab-panel>
        </q-tab-panels>
    </q-page>

    <!-- Bottom Contact Now Button -->
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown" v-if="listingInfo && !hideBottomBar">
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 78px;max-height: 78px;" v-if="tab === 'details'">
        <div class="q-pa-md bg-primary full-width row" v-if="listingInfo.ratesInfo.items.length > 0">
          <div class="col-7">
            <p class="q-my-none text-white"><strong>{{$t(getServiceName(listingInfo.subServiceId[0]))}} {{getCurrencyCode(listingInfo.ratesInfo.items[0].ratesCurrencyId)}} {{listingInfo.ratesInfo.items[0].ratesAmount}}</strong>/{{listingInfo.ratesInfo.items[0].ratesUnit}}</p>
            <p class="q-my-none" v-if="reviewInfo">
              <q-icon name="fas fa-star" style="font-size: 14px;" class="star-color q-mr-xs" v-for="i in listingInfo.serviceReviewsInfo.rating" :key="i"></q-icon>
              <span v-if="reviewInfo.reviewCount > 1" class="text-white" style="font-size: 11px;">({{reviewInfo.reviewCount}} {{$t('reviews')}})</span>
            </p>
            <p style="padding-top: 5px;" v-else><!-- This p tag is here to make UI look better (spacing) --></p>
          </div>
          <q-btn class="col text-weight-bold text-primary" style="border-radius: 6px;" :ripple="false" :label="$t('edit.listing')" color="white" @click="$router.push({name: 'EditListing', params: {listingId: $route.params.listingId}})" v-if="showEdit"></q-btn>
          <div class="col-4" style="max-width: 500px;" v-if="isRequestDetailsRoute">
  <q-btn
    v-if="this.$route.query.invited === 0"
    class="full-width text-weight-bold text-primary"
    style="border-radius: 6px; text-transform: none;"
    :ripple="false"
    :label="$t('invite')"
    color="white"
    @click="triggerinvite()"
  />

  <q-btn
  v-if="this.$route.query.invited === 1"
  class="full-width text-weight-bold text-primary lowercase"
  style="border-radius: 6px; background-color: rgba(255, 255, 255, 0.8); opacity: 0.5; text-transform: none;"
  :ripple="false"
  :label="$t('Invited')"
  color="white"
  :disable="true"
/>
</div>

        </div>
        <div class="q-pa-md bg-white full-width row" v-else>
          <q-btn class="col-12 text-weight-bold" style="border-radius: 6px;" :ripple="false" outline :label="$t('edit.listing')" color="primary" @click="$router.push({name: 'EditListing', params: {listingId: $route.params.listingId}})" v-if="showEdit"></q-btn>
          <q-btn class="col-12 text-weight-bold" style="border-radius: 6px;" :ripple="false" :label="$t('contact.now')" color="primary" @click="contactNowModal = true" v-else></q-btn>
        </div>
      </div>
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 78px;max-height: 78px;" v-else-if="tab === 'reviews' && showEdit">
        <div class="q-pa-md bg-primary full-width row" style="padding-top: 11px;">
          <q-btn class="col-12 text-weight-bold font-normal" style="border-radius: 6px;" flat color="white" :ripple="false" :label="$t('get.more.recommendations')" @click="$router.push({name: 'ShareListing', params: {listingId: $route.params.listingId}})"></q-btn>
        </div>
      </div>
      <div class="row justify-center fixed-bottom shadow-8" style="z-index: 1000;height: 78px;max-height: 78px;" v-else-if="tab === 'reviews'">
        <div class="q-pa-md bg-primary full-width row" style="padding-top: 20px;">
          <q-btn class="col-12 text-weight-bold font-normal" style="border-radius: 6px;" flat color="white" :ripple="false" :label="$t('chat.reviewnow')" @click="$router.push({name: 'Review', params: {serviceUserId: $route.params.listingId}})"></q-btn>
        </div>
      </div>
    </transition>
    <div class="justify-center fixed-bottom shadow-8" style="border-top: 1px solid lightgrey;z-index: 1000;" v-else-if="!hideBottomBar">
      <div class="q-pa-md bg-primary full-width">
        <q-skeleton width="185px" height="15px" class="q-my-xs"></q-skeleton>
        <q-skeleton width="155px" height="15px" class="q-my-xs"></q-skeleton>
      </div>
    </div>

     <!-- Invite Dialog Dialog -->
    <q-dialog v-model="invitemodal"  :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md" >Are you sure ?</h6>
                  <span style="white-space: pre-wrap;">Do you want to invite this Backer to your {{ $t(this.servicename) }} request ?</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" @click="invitesent()" >{{$t('Invite')}}</q-btn>
                <q-btn class="full-width text-capitalize q-my-sm text-primary" flat @click="invitemodal = false">{{$t('Later')}}</q-btn>

              </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Contact Now Dialog -->
    <dialog-contactnow v-if="listingInfo" :trigger="contactNowModal" :userInfo="userInfo" :serviceUri="getServiceLink(listingInfo.subServiceId[0])" :listingInfo="listingInfo" :images="images" @on-close="closeContactNowModal"></dialog-contactnow>

    <!-- Review Dialog -->
    <dialog-reviews :trigger="reviewModal" :reviewInfo="reviewInfo" @on-close="closeReviewModal"></dialog-reviews>

    <!-- More Services Dialog -->
    <dialog-services :trigger="servicesModal" @on-close="triggerServicesModal"></dialog-services>
  </div>
</template>
<script>
import countries from 'assets/countries.json'
import services from 'assets/services.json'

export default {
  components: {
    'carousel-header': () => import('components/Listing/ListingCarousel.vue'),
    'badges-section': () => import('components/Listing/Badges.vue'),
    'review-card': () => import('components/Listing/reviewCards.vue'),
    'dialog-reviews': () => import('components/Listing/DialogReviews.vue'),
    'dialog-contactnow': () => import('components/Listing/DialogContactNow.vue'),
    'listing-card': () => import('components/Explore/listingCards.vue'),
    'dialog-services': () => import('components/DialogServices.vue')
  },

  data () {
    return {
      invitemodal: false,
      isRequestDetailsRoute: false,
      listingInfo: null,
      userInfo: null,
      images: null,
      serviceImages: [],
      reviews: null,
      descriptionHtml: null,
      userInfoHtml: null,
      reviewInfo: null,
      reviewModal: false,
      contactNowModal: false,
      otherListingInfo: [],
      currentPage: 1,
      endOfPage: false,
      isFavorite: false,
      hideBottomBar: false,
      deviceWidth: screen.width,
      showEdit: false,
      tab: 'details',
      slider: 0,
      startInfiniteLoad: false,
      servicesModal: false
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      // Set the isRequestDetailsRoute based on the previous route name
      vm.isRequestDetailsRoute = from && from.name === 'RequestSummary'

      // Log the previous route name to the console
      console.log('Previous route name:', from && from.name)
      console.log('before route Enter reqyesrtdeail value', vm.isRequestDetailsRoute)
    })
  },

  created () {
    this.getListingInfo()
    this.getListingDescription()
    console.log('check the review infi', this.reviewInfo)
    const invited = this.$route.query.invited
    console.log('Invited:', invited)
  },
  mounted () {
    this.$refs['listing-header'].$el.style.top = `${this.$parent.$parent.$parent.$refs.navbar.$el.clientHeight + 1}px`
    this.$refs['listing-tabs'].$el.style.top = `${this.$refs['listing-header'].$el.clientHeight - 36}px`
    console.log('check the listing info', this.listingInfo)
    console.log('Invited:', this.$route.query.params.response)
    if (this.$route.query.reviews === 1) {
      this.tab = 'reviews'
    }
  },
  beforeDestroy () {
    this.$emit('listing-name', null, null)
    this.$emit('listing-favorite', null)
    this.$emit('update-edit-button-status', false)
  },
  methods: {
    invitesent () {
      console.log('invite sent ')
      this.invitemodal = false
      const cachedRequestId = localStorage.getItem('cachedRequestId')
      this.$axios.get(`users/${this.$store.state.user.uuid}/requestassign/${this.listingInfo.id}?requestid=${cachedRequestId}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$router.go(-1)
        this.$q.notify({
          message: `${this.listingInfo.listingName} has been invited to your request!`,
          timeout: 1000,
          type: 'positive',
          position: 'top'
        })
      })
    },

    triggerinvite () {
      this.servicename = localStorage.getItem('servicenameDialog')
      this.invitemodal = true
    },
    triggerServicesModal (status) {
      this.servicesModal = status
    },
    getParentServiceName (parentServiceId) {
      let serviceInfo = this.$_.findWhere(services, {'parentId': parentServiceId})
      if (serviceInfo) {
        return serviceInfo.name
      }

      // fall back from by id
      serviceInfo = this.$_.findWhere(services, {'id': parentServiceId})
      if (serviceInfo) {
        return serviceInfo.name
      }

      return ''
    },
    onScroll (info) {
      if (info.direction === 'down' && info.position >= 4750) {
        this.hideBottomBar = true
      } else if (info.direction === 'up') {
        this.hideBottomBar = false
      }

      if (info.position > 0 && this.$refs['infinite-scroll'] && (info.position >= Math.max(this.$refs['infinite-scroll'].$el.clientHeight - 1500, 0))) {
        this.startInfiniteLoad = true
      } else if (this.$refs['infinite-scroll'] && (info.position < (this.$refs['infinite-scroll'].$el.clientHeight))) {
        this.startInfiniteLoad = false
      }
    },
    getCurrencyCode (countryId) {
      return this.$_.findWhere(countries, {'id': countryId.toString()}).currencyCode
    },
    closeContactNowModal (value) {
      this.contactNowModal = value
      console.log('check the listing info', this.listingInfo)
    },
    closeReviewModal (value) {
      this.reviewModal = value
    },
    onLoad (index, done) {
      if (this.endOfPage || (this.startInfiniteLoad === false)) {
        done()
        return
      }

      setTimeout(() => {
        this.getOtherListingInfo(done)
      }, 2000)
    },
    getOtherListingInfo (done = null) {
      console.log(this.startInfiniteLoad)
      this.$axios.get(`listings/search?per-page=16&page=${this.currentPage}&category_id=${this.listingInfo ? this.listingInfo.parentServiceId : 3}&lang=${this.$store.getters['user/getCurrentLanguage']}&lon=${this.listingInfo.serviceLocation[0].longitude + 0.002}&lat=${this.listingInfo.serviceLocation[0].latitude + 0.002}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.data.searchInfo.items.serviceInfo.length === 0) {
          // insert broadcast button at the end of array
          /* if (this.listingInfo.length > 0 && (this.listingInfo[this.listingInfo.length - 1].parentServiceName !== '1')) {
            let serviceInfo = {
              coverImage: 'statics/images/broadcast-picture.png',
              listingUrl: `/services`,
              parentServiceName: '1'
            }
            this.listingInfo.push(serviceInfo)
          } */

          this.endOfPage = true
        } else if (response.data.searchInfo.items.serviceInfo.length > 0) {
          if (this.currentPage > 1) {
            // insert broadcast buttonas
            let serviceInfo = {
              coverImage: 'statics/images/broadcast-picture.png',
              listingUrl: `/services`,
              parentServiceName: '1'
            }
            let random = parseInt(Math.random() * 10)
            if (random % 2 === 0) {
              response.data.searchInfo.items.serviceInfo.splice(random + 1, 0, serviceInfo)
            } else {
              response.data.searchInfo.items.serviceInfo.splice(random, 0, serviceInfo)
            }
          } else if (this.otherListingInfo.length === 0) {
            response.data.searchInfo.items.serviceInfo.shift()
          }

          this.otherListingInfo = this.otherListingInfo.concat(response.data.searchInfo.items.serviceInfo)
          this.currentPage += 1
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        if (done) {
          done()
        }
      })
    },
    getListingInfo () {
      this.$axios.get(`listings/${this.$route.params.listingId}?lang=${this.$store.getters['user/getCurrentLanguage']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.listingInfo = response.data.listingInfo
        this.userInfo = response.data.listingInfo.userInfo
        this.images = response.data.listingInfo.serviceImage
        this.$emit('listing-name', this.listingInfo.listingName, response.data.listingUrl || response.data.receivedUrl)
      }).catch((error) => {
        console.error(error)
      })
    },
    getListingDescription () {
      this.$axios.get(`users/${this.$route.query.id}/services/${this.$route.params.listingId}?lang=${this.$store.getters['user/getCurrentLanguage']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.descriptionHtml = response.data.serviceInfo.userServiceDescriptionHtml
        this.reviewInfo = response.data.serviceInfo.reviewInfo
        this.userInfoHtml = response.data.serviceInfo.userInfo.aboutMeHtml
        this.serviceImages = response.data.serviceInfo.serviceImage
        this.isFavorite = Boolean(response.data.serviceInfo.isFavorite)

        if (this.$store.getters['user/getUserUuidState'] === response.data.serviceInfo.userInfo.id) {
          this.$emit('update-edit-button-status', true)
          this.showEdit = true
        } else {
          this.$emit('update-edit-button-status', false)
          this.showEdit = false
          this.getOtherListingInfo()
        }

        // emit info to navbar
        this.$emit('listing-favorite', response.data.serviceInfo.isFavorite)
      }).catch((error) => {
        console.error(error)
      })
    },
    favorite () {
      if (this.isFavorite) {
        this.$emit('listing-favorite', false)
        // un-favorite
        this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.$route.params.listingId}/favorites`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.isFavorite = false
        }).catch((error) => {
          console.error(error)
        })
      } else {
        this.$emit('listing-favorite', true)
        // favorite
        this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.$route.params.listingId}/favorites`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.isFavorite = true
        }).catch((error) => {
          console.error(error)
        })
      }
    },
    getServiceName (serviceId) {
      return this.$_.findWhere(services, {'id': serviceId}).shortName
    },
    getServiceLink (serviceId) {
      return this.$_.findWhere(services, {'id': serviceId}).link.split('/')[2]
    }
  }
}
</script>
<style lang="stylus">
.service-image-card
 width: 155px

.resident-pets
  width: 155px !important

@media only screen and (min-width: 320px)
  .service-image-card
    width: 132px !important
  .resident-pets
    width: 128px!important

@media only screen and (min-width: 350px)
  .service-image-card
    width: 150px !important
  .resident-pets
    width: 148px!important

@media only screen and (min-width: 370px)
  .service-image-card
    width: 157px !important
  .resident-pets
    width: 155px!important

@media only screen and (min-width: 410px)
  .service-image-card
    width: 173px !important
  .resident-pets
    width: 173px!important
</style>
